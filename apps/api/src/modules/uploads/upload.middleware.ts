import multer, { StorageEngine, Multer } from "multer";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { logger } from "@assessment-ai/logger";
import { UPLOAD_CONFIG } from "./upload.constants";
import { validateUploadFile } from "./upload.validators";
import { uploadAssignmentIdSchema } from "./upload.types";
import { RequestValidationError } from "../../common/errors";
import { sendErrorResponse } from "../../common/response/error-sender";

/**
 * Create memory storage for multer
 * Files are stored in memory as buffers, not on disk
 */
function createMemoryStorage(): StorageEngine {
  return multer.memoryStorage();
}

/**
 * File filter for multer
 * Additional layer of protection against non-allowed file types at the multer level
 */
function fileFilter(
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void {
  const traceId = req.traceId;

  // Validate extension
  const filename = file.originalname.toLowerCase();
  if (!filename.endsWith(".pdf") && !filename.endsWith(".txt")) {
    logger.warn(
      { filename, mimeType: file.mimetype, traceId },
      "Multer file filter rejected file (invalid extension)",
    );
    callback(new Error(`File type not allowed: ${file.originalname}`), false);
    return;
  }

  // Validate MIME type at entry level
  const baseMimeType = file.mimetype.split(";")[0].trim().toLowerCase();
  if (!UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(baseMimeType)) {
    logger.warn(
      { filename, mimeType: file.mimetype, traceId },
      "Multer file filter rejected file (invalid MIME type)",
    );
    callback(new Error(`MIME type not allowed: ${file.mimetype}`), false);
    return;
  }

  callback(null, true);
}

/**
 * Create multer instance with memory storage
 */
export const uploadMulter: Multer = multer({
  storage: createMemoryStorage(),
  fileFilter,
  limits: {
    fileSize: UPLOAD_CONFIG.FILE_SIZE_LIMIT,
    files: UPLOAD_CONFIG.FILES_LIMIT,
    fields: UPLOAD_CONFIG.FIELDS_LIMIT,
  },
});

/**
 * Middleware to handle multer errors
 */
export const handleMulterError: RequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    logger.warn(
      { multerError: err.code, traceId: req.traceId },
      "Multer error occurred",
    );

    if (err.code === "LIMIT_FILE_SIZE") {
      return sendErrorResponse(
        res,
        new RequestValidationError({
          file: ["File exceeds maximum allowed size"],
        }),
        req.traceId,
      );
    }

    if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_PART_COUNT") {
      return sendErrorResponse(
        res,
        new RequestValidationError({
          file: ["Only one file is allowed per request"],
        }),
        req.traceId,
      );
    }

    if (err.code === "LIMIT_FIELD_SIZE") {
      return sendErrorResponse(
        res,
        new RequestValidationError({
          file: ["Field data exceeds allowed size"],
        }),
        req.traceId,
      );
    }

    return sendErrorResponse(
      res,
      new RequestValidationError({
        file: ["File upload error: " + err.message],
      }),
      req.traceId,
    );
  }

  if (err) {
    logger.warn(
      { error: err, traceId: req.traceId },
      "File upload middleware error",
    );
    return sendErrorResponse(
      res,
      new RequestValidationError({
        file: [err.message || "File upload failed"],
      }),
      req.traceId,
    );
  }

  next();
};

/**
 * Middleware to validate uploaded file
 */
export const validateUploadedFileMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const file = req.file;
  const traceId = req.traceId;

  try {
    const validationResult = validateUploadFile(file, traceId);

    if (!validationResult.valid) {
      logger.warn(
        { errors: validationResult.errors, traceId },
        "File validation failed in middleware",
      );
      return sendErrorResponse(
        res,
        new RequestValidationError({ file: validationResult.errors }),
        traceId,
      );
    }

    logger.debug(
      { filename: file.originalname, size: file.size, traceId },
      "File validation passed",
    );
    next();
  } catch (error) {
    logger.error({ error, traceId }, "File validation middleware error");
    sendErrorResponse(
      res,
      new RequestValidationError({ file: ["File validation error"] }),
      traceId,
    );
  }
};

/**
 * Middleware to validate assignment ID in params
 */
export const validateAssignmentIdMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = uploadAssignmentIdSchema.safeParse({ id: req.params.id });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return sendErrorResponse(
        res,
        new RequestValidationError(errors),
        req.traceId,
      );
    }

    next();
  } catch (error) {
    logger.error(
      { error, traceId: req.traceId },
      "Assignment ID validation error",
    );
    sendErrorResponse(
      res,
      new RequestValidationError({ id: ["Invalid assignment ID"] }),
      req.traceId,
    );
  }
};
