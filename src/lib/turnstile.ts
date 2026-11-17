export const TURNSTILE_ACTION = "contact_enquiry";
export const TURNSTILE_HOSTNAME = "sanoraworks.com";
export const verificationUnavailable = "Security verification is unavailable. Your details are still here; please try again or email enquiries@sanoraworks.com.";
export const verificationFailed = "Security verification could not be completed. Your details are still here; please select Send enquiry to try again or email enquiries@sanoraworks.com.";

export async function verifyTurnstile(
  token: unknown,
  secret: string | undefined,
  fetcher: typeof fetch = fetch,
): Promise<"verified" | "rejected" | "unavailable"> {
  if (typeof token !== "string" || !token.length || token.length > 2048 || /\s/.test(token))
    return "rejected";
  if (!secret?.trim()) return "unavailable";
  try {
    const response = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // No enquiry details or visitor IP are sent to Siteverify.
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return "unavailable";
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("success" in result) || typeof result.success !== "boolean")
      return "unavailable";
    if (!result.success) {
      const codes = "error-codes" in result ? result["error-codes"] : [];
      if (Array.isArray(codes) && codes.some((code) => ["internal-error", "missing-input-secret", "invalid-input-secret"].includes(code)))
        return "unavailable";
      return "rejected";
    }
    return "hostname" in result && result.hostname === TURNSTILE_HOSTNAME &&
      "action" in result && result.action === TURNSTILE_ACTION ? "verified" : "rejected";
  } catch {
    // Do not log exceptions or provider responses: they may contain the token.
    return "unavailable";
  }
}
