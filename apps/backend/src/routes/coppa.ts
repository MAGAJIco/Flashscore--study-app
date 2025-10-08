import express from "express";
import { ObjectId } from "mongodb";
import { filterGamblingContent } from "../middleware/kidsModeFilter";
import { User as UserModel } from "../models/User";

const router = express.Router();

/**
 * Create a COPPA parental consent request.
 * Backend should:
 *  - create a coppaConsent record linked to the user
 *  - send an email (or other) to the parent with a verification link
 * This example only creates the DB record; integrate your mailer to send the link.
 */
router.post("/request-consent", async (req, res) => {
  const { childEmail, childAge, parentEmail } = req.body;
  if (!childEmail || !childAge)
    return res.status(400).json({ error: "childEmail and childAge required" });

  // Lookup or create user
  const user = await UserModel.findOneAndUpdate(
    { email: childEmail },
    {
      $set: {
        age: childAge,
        isUnder13: childAge < 13,
        kidsMode: true,
        "coppaConsent.status": "pending",
        "coppaConsent.parentEmail": parentEmail || null,
        "coppaConsent.requestedAt": new Date(),
      },
    },
    { upsert: true, new: true },
  );

  // TODO: send parental consent email with a secure tokenized link to /api/coppa/verify?token=...
  // For now, return next steps
  return res.json({
    message: "Parental consent requested. Please verify via parent email.",
  });
});

/**
 * Verify parental consent with robust audit trail
 */
router.post("/verify-consent", async (req, res) => {
  const { 
    childEmail, 
    parentConfirmed, 
    verificationToken,
    verificationMethod = 'email_link', // email_link | credit_card | government_id
    parentIdentity // parent name/ID for audit
  } = req.body;

  if (!childEmail || !verificationToken)
    return res.status(400).json({ error: "childEmail and verificationToken required" });

  const user = await UserModel.findOne({ email: childEmail });
  if (!user) return res.status(404).json({ error: "user not found" });

  // Validate token (implement your token validation logic)
  // const isValidToken = await validateVerificationToken(verificationToken, user);
  // if (!isValidToken) return res.status(401).json({ error: "Invalid verification token" });

  const auditEntry = {
    timestamp: new Date(),
    action: parentConfirmed ? 'consent_approved' : 'consent_rejected',
    verificationMethod,
    parentIdentity: parentIdentity || user.coppaConsent?.parentEmail,
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  };

  if (parentConfirmed) {
    user.coppaConsent = {
      status: "approved",
      verifiedAt: new Date(),
      parentEmail: user.coppaConsent?.parentEmail || null,
      verificationMethod,
      parentIdentity,
      auditTrail: [...(user.coppaConsent?.auditTrail || []), auditEntry]
    };
    user.kidsMode = true;
    await user.save();
    
    return res.json({ 
      success: true,
      message: "Parental consent verified",
      consentId: user._id 
    });
  }

  user.coppaConsent = {
    status: "rejected",
    verifiedAt: new Date(),
    parentEmail: user.coppaConsent?.parentEmail || null,
    auditTrail: [...(user.coppaConsent?.auditTrail || []), auditEntry]
  };
  await user.save();
  
  return res.json({ 
    success: false,
    message: "Parental consent rejected" 
  });
});

/**
 * Revoke parental consent
 */
router.post("/revoke-consent", async (req, res) => {
  const { childEmail, parentEmail, reason } = req.body;
  
  if (!childEmail || !parentEmail)
    return res.status(400).json({ error: "childEmail and parentEmail required" });

  const user = await UserModel.findOne({ email: childEmail });
  if (!user) return res.status(404).json({ error: "user not found" });

  // Verify parent identity
  if (user.coppaConsent?.parentEmail !== parentEmail) {
    return res.status(403).json({ error: "Unauthorized: parent email mismatch" });
  }

  const auditEntry = {
    timestamp: new Date(),
    action: 'consent_revoked',
    reason: reason || 'Parent revoked consent',
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  };

  user.coppaConsent = {
    ...user.coppaConsent,
    status: "revoked",
    revokedAt: new Date(),
    auditTrail: [...(user.coppaConsent?.auditTrail || []), auditEntry]
  };

  // Restrict account access
  user.kidsMode = true;
  user.accountRestricted = true;
  
  await user.save();

  return res.json({ 
    success: true,
    message: "Parental consent revoked. Account access restricted." 
  });
});

/**
 * Export consent records (machine-readable format)
 */
router.get("/export-consent/:childEmail", async (req, res) => {
  const { childEmail } = req.params;
  const { parentEmail } = req.query;

  if (!parentEmail) {
    return res.status(400).json({ error: "parentEmail query parameter required" });
  }

  const user = await UserModel.findOne({ email: childEmail });
  if (!user) return res.status(404).json({ error: "user not found" });

  // Verify parent identity
  if (user.coppaConsent?.parentEmail !== parentEmail) {
    return res.status(403).json({ error: "Unauthorized: parent email mismatch" });
  }

  const consentRecord = {
    childEmail: user.email,
    childAge: user.age,
    parentEmail: user.coppaConsent?.parentEmail,
    parentIdentity: user.coppaConsent?.parentIdentity,
    consentStatus: user.coppaConsent?.status,
    verificationMethod: user.coppaConsent?.verificationMethod,
    requestedAt: user.coppaConsent?.requestedAt,
    verifiedAt: user.coppaConsent?.verifiedAt,
    revokedAt: user.coppaConsent?.revokedAt,
    auditTrail: user.coppaConsent?.auditTrail || [],
    exportedAt: new Date(),
    format: 'JSON'
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="consent-record-${childEmail}-${Date.now()}.json"`);
  
  return res.json(consentRecord);
});

/**
 * Example protected content route which uses the kidsMode flag
 * Accepts ?kidsMode=true or checks req.user.kidsMode
 */
router.get("/content", async (req, res) => {
  const kidsMode = (req as any).kidsMode || req.query.kidsMode === "true";
  // load raw content (real implementation will vary)
  const rawContent = await loadContentForSomeEndpoint();

  if (kidsMode) {
    return res.json(filterGamblingContent(rawContent));
  }
  return res.json(rawContent);
});

export default router;

// NOTE: implement loadContentForSomeEndpoint and wire this router into your server.ts
