import File from "../models/file.model.js";
import { generateUrl, deleteFile } from "../utils/signed.js";
import { logger } from "../config/logger.js";
import { processDocument } from "../services/process.js";
import { getPlanLimits } from "../utils/planLimits.js";
import Analytics from "../models/analytics.model.js";

export const createFile = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    const botId = req.params.id;
    if (!botId) {
      return res.status(400).json({
        message: "No bot to add file to",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Enforce document limit for this user's plan
    const { limits } = await getPlanLimits(userId);
    if (limits.documents !== Infinity) {
      const existingDocs = await File.countDocuments({ user: userId });
      if (existingDocs >= limits.documents) {
        return res.status(403).json({
          message: `Your plan allows a maximum of ${limits.documents} document(s). Please upgrade to upload more.`,
          code: "DOCUMENT_LIMIT_REACHED"
        });
      }
    }

    // Enforce monthly message limit
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (limits.messages !== Infinity) {
      const messageCount = await Analytics.countDocuments({
        chatBot: { $in: await File.distinct('chatBot', { user: userId }) },
        createdAt: { $gte: startOfMonth }
      });
      // We check against 90% to warn approaching limit; backend blocks at 100%
      if (messageCount >= limits.messages) {
        return res.status(403).json({
          message: `You have reached your monthly message limit of ${limits.messages}. Please upgrade your plan.`,
          code: "MESSAGE_LIMIT_REACHED"
        });
      }
    }
    const { key, originalname } = req.file;

    // Generate a pre-signed URL so the PDF can be fetched from S3
    const signedUrl = await generateUrl(key);
    const process = await processDocument(signedUrl, botId);

    const file = new File({
      name: originalname,
      s3Key: key,
      user: userId,
      chatBot: botId,
      mimetype: req.file.mimetype,
      size: req.file.size,
      chunks: process,
      isProceed: true,
    });

    await file.save();

    return res.status(200).json({
      message: "Created",
      data: file,
    });
  } catch (error) {
    logger.error("Error creating file", error);
    console.log(error);
    return res.status(500).json({
      message: "Error creating file",
      error: error.message,
    });
  }
};

export const getFiles = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const botId = req.params.id;
    if (!botId) {
      return res.status(400).json({
        message: "No bot to get files for",
      });
    }

    const files = await File.find({ user: userId, chatBot: botId });
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const url = await generateUrl(file.s3Key);

        const obj = file.toObject();
        delete obj.s3Key;

        return {
          ...obj,
          url,
        };
      }),
    );

    return res.status(200).json({
      message: "fetched",
      data: filesWithUrls,
    });
  } catch (error) {
    logger.error("Error fetching files", error);
    console.log(error);
    return res.status(500).json({
      message: "Error fetching files",
      error: error.message,
    });
  }
};

export const getFileById = async (req, res) => {
  try {
    const userId = req.user._id;
    const fileId = req.params.id;

    const file = await File.findOne({ _id: fileId, user: userId });

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const url = await generateUrl(file.s3Key);

    const obj = file.toObject();
    delete obj.s3Key;

    return res.status(200).json({
      message: "File fetched",
      data: {
        ...obj,
        url,
      },
    });
  } catch (error) {
    logger.error("Error fetching file", error);
    console.log(error);
    return res.status(500).json({
      message: "Error fetching file",
      error: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.user._id;
    const fileId = req.params.id;

    const file = await File.findOne({ _id: fileId, user: userId });

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    await deleteFile(file.s3Key);
    await File.deleteOne({ _id: fileId });

    return res.status(200).json({
      message: "File deleted",
    });
  } catch (error) {
    logger.error("Error deleting file", error);
    console.log(error);
    return res.status(500).json({
      message: "Error deleting file",
      error: error.message,
    });
  }
};
