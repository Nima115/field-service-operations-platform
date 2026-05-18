import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../utils/http.js";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (_req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "")}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadRouter = Router();

fs.mkdirSync("uploads", { recursive: true });

uploadRouter.post(
  "/",
  requireAuth,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const body = z.object({ bookingId: z.string().uuid() }).parse(req.body);

    if (!req.file) {
      throw new AppError(422, "A file is required", "FILE_REQUIRED");
    }

    const file = await prisma.file.create({
      data: {
        bookingId: body.bookingId,
        uploadedBy: req.user!.id,
        filePath: path.normalize(req.file.path)
      }
    });

    res.status(201).json(file);
  })
);
