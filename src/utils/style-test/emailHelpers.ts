/**
 * Escapes HTML special characters
 */
export function esc(s: string | null | undefined): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Extracts Google Drive file ID from URL
 */
export function extractDriveId(url: string | null | undefined): string | null {
  const s = String(url || "");
  const m =
    s.match(/drive\.google\.com\/file\/d\/([^/]+)/) ||
    s.match(/[?&]id=([^&]+)/);
  return m ? m[1] : null;
}

/**
 * Converts Google Drive URL to embed URL
 */
export function driveToEmbedUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (/drive\.google\.com\/uc\?/.test(url)) return url;
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/uc?export=view&id=${id}` : url;
}
