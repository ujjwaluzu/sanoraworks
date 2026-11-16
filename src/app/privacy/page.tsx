import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";

export const metadata = pageMetadata(
  "Privacy Policy",
  "How the Sanora Works website handles project enquiry details, locally prepared briefs, and basic website information.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Website information"
        index="PRIVACY"
        title="Privacy Policy"
        description="An explanation of the information this website uses and what happens when you prepare or send a project enquiry."
      />
      <article className="container legal">
        <p className="legal-date">Last updated: 15 November 2026</p>
        <h2>Project enquiry information</h2>
        <p>
          The enquiry form asks for your name, email address, project type, and
          description. Company and estimated budget are optional. Please avoid
          including passwords, financial account details, or other sensitive
          information in your brief.
        </p>
        <h2>When you download a brief</h2>
        <p>
          The download option creates a text file in your browser. The form
          details are not submitted to Sanora Works by that action. This website
          does not save your draft to browser storage; keep the downloaded file
          if you want a copy.
        </p>
        <h2>When online enquiries are available</h2>
        <p>
          If online sending is enabled, the form sends the information you
          provide to our server and configured enquiry service so the enquiry
          can be received and addressed. The page will show whether delivery was
          accepted or could not be confirmed. We do not use project enquiries to
          add you to a marketing list.
        </p>
        <h2>Website operation</h2>
        <p>
          This version of the website does not include advertising trackers or
          analytics scripts. Fonts and interface assets are served with the
          website. The hosting provider may process technical request
          information, such as IP addresses and request timestamps, to operate
          the service.
        </p>
        <h2>External links</h2>
        <p>
          Where configured, links to project websites, GitHub, or LinkedIn take
          you to separate services. Their handling of information is governed by
          their own policies.
        </p>
        <h2>Questions and requests</h2>
        <p>
          {site.email ? (
            <>
              For questions about information you have shared, contact{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </>
          ) : (
            <>
              A verified contact email will be published on the{" "}
              <Link href="/contact">Contact page</Link>. Online enquiries remain
              unavailable until an enquiry service is configured.
            </>
          )}
        </p>
        <h2>Updates</h2>
        <p>
          This notice will be updated as the website’s services and handling of
          information change. The date above identifies the current version.
        </p>
      </article>
    </main>
  );
}
