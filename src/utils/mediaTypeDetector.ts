/**
 * Determines if a file is a media type that can be viewed in a browser
 * @param mimeType - The MIME type of the file
 * @returns true if the file can be viewed in browser, false otherwise
 */
export const isViewableMediaType = (mimeType: string): boolean => {
  if (!mimeType) return false;

  const viewableTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/avif",

    // Videos
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",

    // Audio
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/aac",

    // Documents that browsers can display
    "application/pdf",
    "text/plain",
    "text/html",
    "text/css",
    "text/javascript",
    "application/json",
    "application/xml",
    "text/xml",
  ];

  // Check for exact match
  if (viewableTypes.includes(mimeType.toLowerCase())) {
    return true;
  }

  // Check for wildcard patterns (e.g., image/*, video/*, audio/*, text/*)
  const type = mimeType.toLowerCase().split("/")[0];
  if (["image", "video", "audio", "text"].includes(type)) {
    return true;
  }

  return false;
};
