import type { Enquiry } from "./enquiry.ts";

export interface EnquiryEmail {
  from: { email: string; name: string };
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}
export interface ContactBindings {
  ENQUIRY_EMAIL?: { send(message: EnquiryEmail): Promise<{ messageId: string }> };
  ENQUIRY_RATE_LIMIT?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

export function enquiryEmail(data: Enquiry): EnquiryEmail {
  return {
    from: { email: "enquiries@sanoraworks.com", name: "SanoraWorks Website" },
    to: "sanoraworks@gmail.com",
    replyTo: data.email,
    subject: `New project enquiry: ${data.projectType}`,
    text: [
      "A new enquiry from sanoraworks.com",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company: ${data.company || "Not provided"}`,
      `Project type: ${data.projectType}`,
      `Estimated budget: ${data.budget || "Not provided"}`,
      "",
      "PROJECT DESCRIPTION",
      data.description,
      "",
      "Use Reply to respond directly to the visitor.",
    ].join("\n"),
  };
}
