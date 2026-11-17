import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createEnquiryHandler } from "@/lib/enquiry-handler";
import type { ContactBindings } from "@/lib/enquiry-email";

export const runtime = "nodejs";

declare global {
  interface CloudflareEnv {
    ENQUIRY_EMAIL?: ContactBindings["ENQUIRY_EMAIL"];
    ENQUIRY_RATE_LIMIT?: ContactBindings["ENQUIRY_RATE_LIMIT"];
  }
}

export const POST = createEnquiryHandler(async () => {
  try { return (await getCloudflareContext({ async: true })).env; }
  catch { return null; }
});
