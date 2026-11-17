import { validateEnquiry } from "./enquiry.ts";
import { enquiryEmail, type ContactBindings } from "./enquiry-email.ts";

function reply(body: object, status: number, headers?: Record<string, string>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}
const unavailable = "We couldn’t send your enquiry. Your details are still here; please try again or email enquiries@sanoraworks.com.";

export function createEnquiryHandler(getBindings: () => Promise<ContactBindings | null>) {
  return async function POST(request: Request) {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin && origin !== "https://sanoraworks.com")
      return reply({ error: "Please send your enquiry from the Sanora Works website." }, 403);
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
      return reply({ error: "Please submit the project enquiry form." }, 415);
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Your enquiry was empty. Please check the form." }, 400);
    let input: unknown;
    try {
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 32_768) {
          await reader.cancel();
          return reply({ error: "Your enquiry is too large. Keep the description under 5,000 characters." }, 413);
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      input = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return reply({ error: "We couldn’t read the enquiry. Please try again." }, 400);
    }
    const result = validateEnquiry(input);
    if (!result.success) return reply({ error: "Please check the highlighted fields.", errors: result.errors }, 400);
    try {
      const bindings = await getBindings();
      if (!bindings?.ENQUIRY_EMAIL || !bindings.ENQUIRY_RATE_LIMIT)
        return reply({ error: unavailable }, 503);

      // Cloudflare supplies the connecting IP. Retain only its digest in rate-limit keys.
      const ip = request.headers.get("cf-connecting-ip") ?? "local";
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
      const key = `enquiry:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
      const limit = await bindings.ENQUIRY_RATE_LIMIT.limit({ key });
      if (!limit.success) return reply({ error: "Too many enquiries. Please wait a minute before trying again." }, 429, { "Retry-After": "60" });

      const sent = await bindings.ENQUIRY_EMAIL.send(enquiryEmail(result.data));
      if (!sent?.messageId) return reply({ error: unavailable }, 502);
      return reply({ message: "Your enquiry has been sent. Thank you for sharing your idea." }, 202);
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "UNKNOWN";
      // Log a provider code only: visitor details and message content stay out of application logs.
      console.error("Enquiry delivery failed:", code);
      if (code === "E_RATE_LIMIT_EXCEEDED")
        return reply({ error: "Too many enquiries. Please wait a minute before trying again." }, 429, { "Retry-After": "60" });
      return reply({ error: unavailable }, 502);
    }
  };
}
