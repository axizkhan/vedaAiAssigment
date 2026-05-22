import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../middleware/error.middleware";
import {
  uploadMulter,
  handleMulterError,
  validateUploadedFileMiddleware,
  validateAssignmentIdMiddleware,
} from "./upload.middleware";
import { uploadAssignmentFileController } from "./upload.controller";

export const uploadsRouter: Router = Router();

/**
 * POST /api/v1/assignments/:id/upload
 * Upload a file (PDF or TXT) for an assignment
 *
 * Authentication: Required
 * Content-Type: multipart/form-data
 * Body: { file: File }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "fileKey": "uploads/...",
 *     "extractedText": "...",
 *     "tokenCount": 5230
 *   }
 * }
 */
uploadsRouter.post(
  "/:id/upload",
  authMiddleware,
  validateAssignmentIdMiddleware,
  uploadMulter.single("file"),
  handleMulterError,
  validateUploadedFileMiddleware,
  asyncHandler(uploadAssignmentFileController),
);

export default uploadsRouter;
