import { Button } from "@/components/ui/Button";
import { EngineeringForm } from "./EngineeringForm";
import { requirePublicPage } from '@/data/public-content';
export function Hero() {
  return (
    <section className="home-welcome">
      <h1>{requirePublicPage('/').h1}</h1>
      <p className="welcome-intro">
        {requirePublicPage('/').intro}
      </p>
      <div className="hero-actions">
        <Button href="/contact#contact-title">Tell us what you need</Button>
        <Button href="/work" variant="secondary">
          See our projects
        </Button>
      </div>
      <EngineeringForm />
      <nav className="section-shortcuts" aria-label="On this page">
        <span>Jump to</span>
        <a href="#capabilities">Services</a>
        <a href="#projects">Projects</a>
        <a href="#process">Our process</a>
      </nav>
    </section>
  );
}
