export const projectTypes = [
  "Software & Web Development",
  "Product Engineering",
  "AI & Intelligent Automation",
  "Cloud & Infrastructure",
  "Let’s work it out together",
] as const;
export const budgetOptions = [
  "Not yet defined",
  "Under US$5,000",
  "US$5,000–15,000",
  "US$15,000–50,000",
  "US$50,000+",
] as const;

export type Enquiry = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  description: string;
  website: string;
};
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

export function validateEnquiry(
  input: unknown,
):
  { success: true; data: Enquiry } | { success: false; errors: EnquiryErrors } {
  const source =
    input && typeof input === "object" && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const text = (key: keyof Enquiry) =>
    typeof source[key] === "string" ? source[key].trim() : "";
  const data: Enquiry = {
    name: text("name"),
    email: text("email"),
    company: text("company"),
    projectType: text("projectType"),
    budget: text("budget"),
    description: text("description"),
    website: text("website"),
  };
  const errors: EnquiryErrors = {};
  if (data.name.length < 2 || data.name.length > 100)
    errors.name = "Enter your name, between 2 and 100 characters.";
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address, such as name@company.com.";
  if (data.company.length > 160)
    errors.company = "Keep the company name under 160 characters.";
  if (!projectTypes.some((type) => type === data.projectType))
    errors.projectType = "Choose the kind of project you have in mind.";
  if (data.budget && !budgetOptions.some((option) => option === data.budget))
    errors.budget = "Choose one of the listed budget ranges.";
  if (data.description.length < 30 || data.description.length > 5000)
    errors.description =
      "Tell us a little more: use between 30 and 5,000 characters.";
  if (data.website) errors.website = "This enquiry could not be accepted.";
  return Object.keys(errors).length
    ? { success: false, errors }
    : { success: true, data };
}

export function formatProjectBrief(data: Enquiry) {
  return [
    "SANORA WORKS: PROJECT BRIEF",
    "Prepared locally. This brief has not been sent.",
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
    "Practical technology. Built for your business.",
    "https://sanoraworks.com",
  ].join("\n");
}
