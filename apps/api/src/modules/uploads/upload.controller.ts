import { Request, Response } from "express";
import { logger } from "@assessment-ai/logger";
import { sendSuccessResponse } from "../../common/response";
import { sendErrorResponse } from "../../common/response/error-sender";
import { uploadService } from "./upload.service";
import { mapUploadToResponse } from "./upload.mapper";

/**
 * Upload file for assignment
 * Expects multipart/form-data with single file
 */
export async function uploadAssignmentFileController(
  req: Request,
  res: Response,
): Promise<Response<any>> {
  const traceId = req.traceId;

  try {
    // Require authentication
    if (!req.user?.id) {
      return sendErrorResponse(
        res,
        new Error("Authentication required"),
        traceId,
      );
    }

    // Get file from multer
    if (!req.file) {
      return sendErrorResponse(res, new Error("No file provided"), traceId);
    }

    logger.debug(
      {
        assignmentId: req.params.id,
        userId: req.user.id,
        filename: req.file.originalname,
        size: req.file.size,
        traceId,
      },
      "Upload request received",
    );

    // Call upload service
    const uploadResult = await uploadService.uploadAssignmentFile({
      assignmentId: req.params.id,
      file: req.file,
      userId: req.user.id,
      traceId,
    });

    // Map to response format
    const response = mapUploadToResponse(uploadResult);

    logger.info(
      {
        assignmentId: req.params.id,
        userId: req.user.id,
        tokenCount: response.tokenCount,
        traceId,
      },
      "File upload completed",
    );

    return sendSuccessResponse(res, {
      statusCode: 200,
      data: response,
      traceId,
    });
  } catch (error) {
    logger.error(
      { error, assignmentId: req.params.id, userId: req.user?.id, traceId },
      "Upload controller error",
    );
    return sendErrorResponse(res, error, traceId);
  }
}
