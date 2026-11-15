import "server-only";

export function getContactEndpoint(): string | null {
  const value = process.env.CONTACT_WEBHOOK_URL;
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url.href : null; } catch { return null; }
}
