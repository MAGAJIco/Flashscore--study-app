import express from "express";
import { ObjectId } from "mongodb";
import { filterGamblingContent } from "../middleware/kidsModeFilter";
// Assume you have a User model accessible (Mongoose or native)
import UserModel from "../../models/User"; // adjust path to actual model

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
 * Verify parental consent (called by verification link).
 * The verification link handler should:
 *  - validate token and identify child user
 *  - set coppaConsent.status = 'approved' and store verifiedAt
 */
router.post("/verify-consent", async (req, res) => {
  const { childEmail, parentConfirmed } = req.body;
  if (!childEmail)
    return res.status(400).json({ error: "childEmail required" });

  const user = await UserModel.findOne({ email: childEmail });
  if (!user) return res.status(404).json({ error: "user not found" });

  if (parentConfirmed) {
    user.coppaConsent = {
      status: "approved",
      verifiedAt: new Date(),
      parentEmail: user.coppaConsent?.parentEmail || null,
    };
    // Optionally allow more features
    user.kidsMode = true; // keep kids mode on by default
    await user.save();
    return res.json({ message: "Parental consent verified" });
  }

  user.coppaConsent = {
    status: "rejected",
    verifiedAt: new Date(),
    parentEmail: user.coppaConsent?.parentEmail || null,
  };
  await user.save();
  return res.json({ message: "Parental consent rejected" });
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
