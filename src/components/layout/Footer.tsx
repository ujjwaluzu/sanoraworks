import Link from "next/link";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-bottom">
        <p>© 2026 SanoraWorks. All rights reserved.</p>
        <SocialLinks label="Footer social media" />
        <nav aria-label="Footer navigation">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href="/brand/sanoraworks-brand-kit.zip" download>
            Brand kit
          </a>
          <a href="#top">Back to top ↑</a>
        </nav>
      </div>
    </footer>
  );
}
