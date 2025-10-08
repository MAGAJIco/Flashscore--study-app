
import express from "express";
import { User as UserModel } from "../models/User";
import archiver from "archiver";
import { Readable } from "stream";

const router = express.Router();

/**
 * Export all child's data (COPPA compliance)
 * Returns: ZIP file with JSON data
 */
router.get("/export-data/:childEmail", async (req, res) => {
  const { childEmail } = req.params;
  const { parentEmail } = req.query;

  if (!parentEmail) {
    return res.status(400).json({ error: "parentEmail query parameter required" });
  }

  try {
    const user = await UserModel.findOne({ email: childEmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Verify parent identity
    if (user.coppaConsent?.parentEmail !== parentEmail) {
      return res.status(403).json({ error: "Unauthorized: parent email mismatch" });
    }

    const userData = {
      personalInfo: {
        username: user.username,
        email: user.email,
        age: user.age,
        createdAt: user.createdAt,
        lastActive: user.lastActive
      },
      consent: user.coppaConsent,
      preferences: user.preferences,
      accessRestrictions: user.accessRestrictions,
      exportedAt: new Date(),
      exportFormat: 'JSON'
    };

    // Create ZIP archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${childEmail}-${Date.now()}.zip"`);
    
    archive.pipe(res);
    archive.append(JSON.stringify(userData, null, 2), { name: 'user-data.json' });
    await archive.finalize();

  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Failed to export data' });
  }
});

/**
 * Delete child's data (COPPA compliance)
 */
router.post("/delete-data", async (req, res) => {
  const { childEmail, parentEmail, confirmationCode } = req.body;

  if (!childEmail || !parentEmail || !confirmationCode) {
    return res.status(400).json({ error: "childEmail, parentEmail, and confirmationCode required" });
  }

  try {
    const user = await UserModel.findOne({ email: childEmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Verify parent identity
    if (user.coppaConsent?.parentEmail !== parentEmail) {
      return res.status(403).json({ error: "Unauthorized: parent email mismatch" });
    }

    // Verify confirmation code (implement your own logic)
    // const isValidCode = await verifyDeletionCode(confirmationCode, user);
    // if (!isValidCode) return res.status(401).json({ error: "Invalid confirmation code" });

    // Log deletion for audit trail
    const deletionLog = {
      userId: user._id,
      userEmail: user.email,
      parentEmail,
      deletedAt: new Date(),
      requestIp: req.ip,
      confirmationCode
    };

    // Permanent deletion
    await UserModel.deleteOne({ _id: user._id });

    return res.json({
      success: true,
      message: "User data permanently deleted",
      deletionLog
    });

  } catch (error) {
    console.error('Deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete data' });
  }
});

/**
 * Rectify/update child's profile data
 */
router.post("/rectify-data", async (req, res) => {
  const { childEmail, parentEmail, updates } = req.body;

  if (!childEmail || !parentEmail || !updates) {
    return res.status(400).json({ error: "childEmail, parentEmail, and updates required" });
  }

  try {
    const user = await UserModel.findOne({ email: childEmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Verify parent identity
    if (user.coppaConsent?.parentEmail !== parentEmail) {
      return res.status(403).json({ error: "Unauthorized: parent email mismatch" });
    }

    // Allow only safe profile updates
    const allowedFields = ['username', 'preferences'];
    const safeUpdates: any = {};
    
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        safeUpdates[key] = updates[key];
      }
    }

    await user.updateOne(safeUpdates);

    return res.json({
      success: true,
      message: "Profile data updated successfully",
      updatedFields: Object.keys(safeUpdates)
    });

  } catch (error) {
    console.error('Rectification error:', error);
    return res.status(500).json({ error: 'Failed to update data' });
  }
});

export default router;
