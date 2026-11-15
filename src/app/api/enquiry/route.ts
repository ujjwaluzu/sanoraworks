import { validateEnquiry } from "@/lib/enquiry";
import { getContactEndpoint } from "@/lib/contact-server";
import { site } from "@/data/site";

export const runtime = "nodejs";

function reply(body: object, status: number) { return Response.json(body, { status, headers: { "Cache-Control": "no-store" } }); }

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin && origin !== site.url) return reply({ error: "Please send your enquiry from the Sanora Works website." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return reply({ error: "Please submit the project enquiry form." }, 415);
  const reader = request.body?.getReader();
  if (!reader) return reply({ error: "Your enquiry was empty. Please check the form." }, 400);
  let input: unknown;
  try {
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32_768) { await reader.cancel(); return reply({ error: "Your enquiry is too large. Keep the description under 5,000 characters." }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    input = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return reply({ error: "We couldn’t read the enquiry. Please try again." }, 400); }
  const result = validateEnquiry(input);
  if (!result.success) return reply({ error: "Please check the highlighted fields.", errors: result.errors }, 400);
  const endpoint = getContactEndpoint();
  if (!endpoint) return reply({ error: "Online enquiries are not available yet. Download your project brief to keep a copy; your message has not been sent." }, 503);
  try {
    const { website: _honeypot, ...enquiry } = result.data;
    void _honeypot;
    const response = await fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json", ...(process.env.CONTACT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` } : {}) },
      body: JSON.stringify({ ...enquiry, submittedAt: new Date().toISOString(), source: site.url }),
      signal: AbortSignal.timeout(10_000), redirect: "error", cache: "no-store",
    });
    if (!response.ok) return reply({ error: "The enquiry service couldn’t accept your message. Your brief is still here; try again or download a copy." }, 502);
    return reply({ message: "Your project enquiry has been accepted. Thank you for sharing your idea." }, 202);
  } catch { return reply({ error: "We couldn’t confirm delivery. Keep a copy of your brief and try again later." }, 502); }
}
