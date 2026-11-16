import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-badges" aria-label="Workshop badges">
        <Badge
          top="SANORAWORKS"
          label="Independent Works"
          symbol="✦"
          href="/about"
        />
        <Badge
          top="ENGINEERING"
          label="Built with Purpose"
          symbol="S"
          tone="cream"
        />
        <Badge
          top="STEP INSIDE"
          label="Explore the Projects"
          symbol="↗"
          href="/work"
          tone="navy"
        />
      </div>
      <p className="footer-motto">
        Independent thinking. Purposeful engineering.
      </p>
      <div className="footer-bottom">
        <p>© 2026 SanoraWorks. All rights reserved.</p>
        <nav aria-label="Footer navigation">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href="#top">Back to top ↑</a>
        </nav>
      </div>
    </footer>
  );
}
