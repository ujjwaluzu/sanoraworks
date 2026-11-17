import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";

export const metadata = pageMetadata(
  "Privacy Policy",
  "How the Sanora Works website handles project enquiry details, email delivery, and basic website information.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Website information"
        index="PRIVACY"
        title="Privacy Policy"
        description="An explanation of the information this website uses and what happens when you send a project enquiry."
      />
      <article className="container legal">
        <p className="legal-date">Last updated: 17 November 2026</p>
        <h2>Project enquiry information</h2>
        <p>
          The enquiry form asks for your name, email address, project type, and
          description. Company and estimated budget are optional. Please avoid
          including passwords, financial account details, or other sensitive
          information in your message.
        </p>
        <h2>When you send an enquiry</h2>
        <p>
          The form sends your details through our Cloudflare-hosted website and
          Cloudflare Email Service to our Gmail inbox, where Google processes
          the email. We use this information to respond to your enquiry. Your
          email address is included as the Reply-To address so we can reply
          directly. We do not add you to a marketing list.
        </p>
        <p>
          The website does not save form drafts in browser storage or a project
          database. A failed submission keeps your entries on the page so you
          can retry. Enquiries received in our mailbox are retained as business
          correspondence; you can contact us to request deletion.
        </p>
        <h2>Website operation</h2>
        <p>
          This version of the website does not include advertising trackers or
          analytics scripts. Fonts and interface assets are served with the
          website. The hosting provider may process technical request
          information, such as IP addresses and request timestamps, to operate
          the service. We use a digest of the connecting IP address to limit
          repeated form submissions, together with a hidden field to reject
          automated spam. Application error logs contain delivery error codes,
          not enquiry contents.
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
