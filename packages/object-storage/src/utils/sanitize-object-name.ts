/**
 * Sanitizes object names for safe S3/MinIO storage
 * Removes path traversal attempts, special characters, and normalizes filenames
 */
export function sanitizeObjectName(filename: string): string {
  // Remove path traversal attempts
  let safe = filename.replace(/\.\.\//g, "").replace(/\.\.\\/g, "");

  // Remove leading/trailing dots
  safe = safe.replace(/^\.+/, "").replace(/\.+$/, "");

  // Remove path separators
  safe = safe.replace(/[\/\\]/g, "_");

  // Keep only safe characters: alphanumeric, dots, hyphens, underscores
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, "_");

  // Remove consecutive special characters
  safe = safe.replace(/_+/g, "_").replace(/\.+/g, ".");

  // Ensure not empty
  if (!safe || safe.length === 0) {
    safe = "unnamed_file";
  }

  // Limit length
  if (safe.length > 255) {
    const dotIndex = safe.lastIndexOf(".");
    if (dotIndex > 0) {
      const ext = safe.substring(dotIndex);
      const name = safe.substring(0, 255 - ext.length);
      safe = name + ext;
    } else {
      safe = safe.substring(0, 255);
    }
  }

  return safe;
}

/**
 * Generates a safe object key with timestamp and sanitized filename
 * Format: assignments/{assignmentId}/{timestamp}_{safeFilename}
 */
export function generateObjectKey(
  assignmentId: string,
  originalFilename: string,
): string {
  const timestamp = Date.now();
  const sanitized = sanitizeObjectName(originalFilename);
  return `assignments/${assignmentId}/${timestamp}_${sanitized}`;
}

/**
 * Extracts the file extension from a filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) return "";
  return filename.substring(lastDot).toLowerCase();
}

/**
 * Extracts the base filename without extension
 */
export function getBaseName(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) return filename;
  return filename.substring(0, lastDot);
}
