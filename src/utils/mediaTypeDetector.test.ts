import { isViewableMediaType } from "./mediaTypeDetector";

describe("isViewableMediaType", () => {
  describe("image types", () => {
    it("should return true for common image formats", () => {
      expect(isViewableMediaType("image/jpeg")).toBe(true);
      expect(isViewableMediaType("image/jpg")).toBe(true);
      expect(isViewableMediaType("image/png")).toBe(true);
      expect(isViewableMediaType("image/gif")).toBe(true);
      expect(isViewableMediaType("image/webp")).toBe(true);
      expect(isViewableMediaType("image/svg+xml")).toBe(true);
    });

    it("should return true for image/* wildcard", () => {
      expect(isViewableMediaType("image/x-icon")).toBe(true);
      expect(isViewableMediaType("image/tiff")).toBe(true);
    });
  });

  describe("video types", () => {
    it("should return true for common video formats", () => {
      expect(isViewableMediaType("video/mp4")).toBe(true);
      expect(isViewableMediaType("video/webm")).toBe(true);
      expect(isViewableMediaType("video/ogg")).toBe(true);
    });

    it("should return true for video/* wildcard", () => {
      expect(isViewableMediaType("video/x-msvideo")).toBe(true);
    });
  });

  describe("audio types", () => {
    it("should return true for common audio formats", () => {
      expect(isViewableMediaType("audio/mpeg")).toBe(true);
      expect(isViewableMediaType("audio/mp3")).toBe(true);
      expect(isViewableMediaType("audio/wav")).toBe(true);
      expect(isViewableMediaType("audio/ogg")).toBe(true);
    });

    it("should return true for audio/* wildcard", () => {
      expect(isViewableMediaType("audio/flac")).toBe(true);
    });
  });

  describe("document types", () => {
    it("should return true for PDF", () => {
      expect(isViewableMediaType("application/pdf")).toBe(true);
    });

    it("should return true for text formats", () => {
      expect(isViewableMediaType("text/plain")).toBe(true);
      expect(isViewableMediaType("text/html")).toBe(true);
      expect(isViewableMediaType("text/css")).toBe(true);
      expect(isViewableMediaType("text/javascript")).toBe(true);
      expect(isViewableMediaType("application/json")).toBe(true);
    });

    it("should return true for text/* wildcard", () => {
      expect(isViewableMediaType("text/csv")).toBe(true);
      expect(isViewableMediaType("text/markdown")).toBe(true);
    });
  });

  describe("non-viewable types", () => {
    it("should return false for non-viewable formats", () => {
      expect(isViewableMediaType("application/zip")).toBe(false);
      expect(isViewableMediaType("application/x-tar")).toBe(false);
      expect(isViewableMediaType("application/vnd.ms-excel")).toBe(false);
      expect(isViewableMediaType("application/msword")).toBe(false);
    });

    it("should return false for empty or invalid mime types", () => {
      expect(isViewableMediaType("")).toBe(false);
      expect(isViewableMediaType("invalid")).toBe(false);
    });
  });

  describe("case sensitivity", () => {
    it("should handle uppercase mime types", () => {
      expect(isViewableMediaType("IMAGE/JPEG")).toBe(true);
      expect(isViewableMediaType("Video/MP4")).toBe(true);
      expect(isViewableMediaType("AUDIO/MPEG")).toBe(true);
    });
  });
});
