import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function AboutPreview() {
  return <section className="section section-about"><div className="container about-preview-layout"><SectionHeading eyebrow="Independent by design" number="05">We believe in building technology that moves things forward.</SectionHeading><div className="about-preview-copy"><p>SANORA WORKS is an independent technology and engineering company focused on developing digital solutions, software products and intelligent systems.</p><p>Our approach combines research, architecture, engineering and innovation to turn complex challenges into practical, reliable solutions.</p><p>We don’t just build what’s required today. We think about what will be needed tomorrow.</p><Button href="/about" variant="text">Discover Sanora Works</Button></div></div></section>;
}
