/**
 * Validates and sanitizes URLs to prevent javascript: and data: XSS attacks.
 * Use this for any dynamic href/src attributes that come from API data.
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Block dangerous protocols
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
    return null;
  } catch {
    return null;
  }
}
