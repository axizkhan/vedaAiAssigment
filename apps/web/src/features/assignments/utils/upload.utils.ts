import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "../constants/assignment-flow.constants";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return "File size must be less than 10MB";
  }
  const validTypes = [
    ...ALLOWED_FILE_TYPES,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ];
  if (!validTypes.includes(file.type)) {
    return "Only PDF, DOCX, TXT, JPEG, and PNG files are supported";
  }
  return null;
};
