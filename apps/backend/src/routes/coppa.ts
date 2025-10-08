
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "mongodb";
import { filterGamblingContent } from "../middleware/kidsModeFilter";
import { User as UserModel } from "../models/User";

export default async function coppaRouter(fastify: FastifyInstance) {
  /**
   * Create a COPPA parental consent request.
   */
  fastify.post("/request-consent", async (request: FastifyRequest, reply: FastifyReply) => {
    const { childEmail, childAge, parentEmail } = request.body as any;
    if (!childEmail || !childAge)
      return reply.status(400).send({ error: "childEmail and childAge required" });

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

    return reply.send({
      message: "Parental consent requested. Please verify via parent email.",
    });
  });

  /**
   * Verify parental consent with robust audit trail
   */
  fastify.post("/verify-consent", async (request: FastifyRequest, reply: FastifyReply) => {
    const { 
      childEmail, 
      parentConfirmed, 
      verificationToken,
      verificationMethod = 'email_link',
      parentIdentity
    } = request.body as any;

    if (!childEmail || !verificationToken)
      return reply.status(400).send({ error: "childEmail and verificationToken required" });

    const user = await UserModel.findOne({ email: childEmail });
    if (!user) return reply.status(404).send({ error: "user not found" });

    const auditEntry = {
      timestamp: new Date(),
      action: parentConfirmed ? 'consent_approved' : 'consent_rejected',
      verificationMethod,
      parentIdentity: parentIdentity || user.coppaConsent?.parentEmail,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent']
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
      
      return reply.send({ 
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
    
    return reply.send({ 
      success: false,
      message: "Parental consent rejected" 
    });
  });

  /**
   * Revoke parental consent
   */
  fastify.post("/revoke-consent", async (request: FastifyRequest, reply: FastifyReply) => {
    const { childEmail, parentEmail, reason } = request.body as any;
    
    if (!childEmail || !parentEmail)
      return reply.status(400).send({ error: "childEmail and parentEmail required" });

    const user = await UserModel.findOne({ email: childEmail });
    if (!user) return reply.status(404).send({ error: "user not found" });

    if (user.coppaConsent?.parentEmail !== parentEmail) {
      return reply.status(403).send({ error: "Unauthorized: parent email mismatch" });
    }

    const auditEntry = {
      timestamp: new Date(),
      action: 'consent_revoked',
      reason: reason || 'Parent revoked consent',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent']
    };

    user.coppaConsent = {
      ...user.coppaConsent,
      status: "revoked",
      revokedAt: new Date(),
      auditTrail: [...(user.coppaConsent?.auditTrail || []), auditEntry]
    };

    user.kidsMode = true;
    user.accountRestricted = true;
    
    await user.save();

    return reply.send({ 
      success: true,
      message: "Parental consent revoked. Account access restricted." 
    });
  });

  /**
   * Export consent records (machine-readable format)
   */
  fastify.get("/export-consent/:childEmail", async (request: FastifyRequest, reply: FastifyReply) => {
    const { childEmail } = request.params as any;
    const { parentEmail } = request.query as any;

    if (!parentEmail) {
      return reply.status(400).send({ error: "parentEmail query parameter required" });
    }

    const user = await UserModel.findOne({ email: childEmail });
    if (!user) return reply.status(404).send({ error: "user not found" });

    if (user.coppaConsent?.parentEmail !== parentEmail) {
      return reply.status(403).send({ error: "Unauthorized: parent email mismatch" });
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

    reply.header('Content-Type', 'application/json');
    reply.header('Content-Disposition', `attachment; filename="consent-record-${childEmail}-${Date.now()}.json"`);
    
    return reply.send(consentRecord);
  });

  /**
   * Example protected content route
   */
  fastify.get("/content", async (request: FastifyRequest, reply: FastifyReply) => {
    const kidsMode = (request as any).kidsMode || (request.query as any).kidsMode === "true";
    const rawContent = await loadContentForSomeEndpoint();

    if (kidsMode) {
      return reply.send(filterGamblingContent(rawContent));
    }
    return reply.send(rawContent);
  });
}

async function loadContentForSomeEndpoint() {
  return { sample: "content" };
}
