import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EngineeringForm } from "./EngineeringForm";

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-main">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">
            <span className="status-dot" />
            Independent technology & engineering company
          </p>
          <h1>
            Engineering ideas into meaningful <span>digital solutions.</span>
          </h1>
          <p className="hero-description">
            We design, develop and engineer digital products, intelligent
            systems and technology solutions that help businesses move forward.
          </p>
          <div className="hero-actions">
            <Button href="/work">Explore our work</Button>
            <Button href="/contact" variant="text">
              Start a project
            </Button>
          </div>
        </div>
        <EngineeringForm />
      </div>
      <div className="container hero-bottom">
        <a href="#capabilities" className="scroll-link">
          <ArrowDown size={14} aria-hidden="true" />
          Scroll to explore
        </a>
        <span className="hero-bottom-note">
          Built with purpose. Engineered for what’s next.
        </span>
        <span className="mono hero-index">01 — 06</span>
      </div>
    </section>
  );
}
