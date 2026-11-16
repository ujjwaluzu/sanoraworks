import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
export function AboutPreview() {
  return (
    <Panel
      title="Independent by design"
      className="section-about"
    >
      <p>
        SanoraWorks is an independent technology and engineering company focused
        on digital solutions, software products, and intelligent systems.
      </p>
      <p>
        Our approach combines research, architecture, engineering, and
        innovation to turn complex challenges into practical, reliable
        solutions. We think about what’s needed today and what will be needed
        tomorrow.
      </p>
      <Link href="/about">Meet SanoraWorks →</Link>
    </Panel>
  );
}
