import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
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
