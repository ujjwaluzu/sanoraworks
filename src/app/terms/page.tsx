import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";

export const metadata = pageMetadata(
  "Terms of Service",
  "Information about using the Sanora Works website, independent project previews, enquiries, and project agreements.",
  "/terms",
);

export default function TermsPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Website information"
        index="TERMS"
        title="Terms of Service"
        description="Information about the website, the work presented here, and the starting point for a project conversation."
      />
      <article className="container legal">
        <p className="legal-date">Last updated: 15 November 2026</p>
        <h2>About this website</h2>
        <p>
          The Sanora Works website introduces our technology and engineering
          services and independent projects. Its content is general information.
          A project enquiry or conversation does not create a
          service agreement or a commitment to deliver work.
        </p>
        <h2>Project agreements</h2>
        <p>
          Scope, deliverables, schedule, pricing, ownership, support, and other
          commercial terms are defined in a separate written project agreement.
          Budget ranges in the enquiry form help describe a project; they are
          not quotes or published service prices.
        </p>
        <h2>Independent projects and previews</h2>
        <p>
          UzzUTV, RepoTeam, and CrewLab are presented as independent projects.
          Interface previews on this site are illustrative concepts and are
          labeled accordingly. They do not establish the current availability or
          features of a live product. Technology stacks and external URLs are
          only published when confirmed.
        </p>
        <h2>Website content</h2>
        <p>
          Sanora Works branding and original website content are reserved by
          their respective owners. Third-party software, fonts, and other
          licensed materials retain their own licenses. Linking to this website
          does not transfer rights to its content.
        </p>
        <h2>Responsible use</h2>
        <p>
          Please use the website and enquiry form for legitimate conversations.
          Do not submit malicious code, unwanted bulk messages, private
          credentials, or information you are not authorised to share.
        </p>
        <h2>Availability and external services</h2>
        <p>
          Website content and availability may change. External links, when
          present, lead to services operated separately from this website. A
          form error means delivery has not been confirmed; keep a copy of your
          brief if needed.
        </p>
        <h2>Questions</h2>
        <p>
          Visit the <Link href="/contact">Contact page</Link> for the current
          contact options, and read the{" "}
          <Link href="/privacy">Privacy Policy</Link> for details about enquiry
          information.
        </p>
      </article>
    </main>
  );
}
