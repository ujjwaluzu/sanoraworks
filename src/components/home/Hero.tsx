import { Button } from "@/components/ui/Button";
import { EngineeringForm } from "./EngineeringForm";
export function Hero() {
  return (
    <section className="home-welcome">
      <h1>Welcome to SanoraWorks</h1>
      <p className="welcome-intro">
        We design and engineer digital products, intelligent systems, and
        dependable software that helps businesses move forward.
      </p>
      <div className="hero-actions">
        <Button href="/work">Explore the projects</Button>
        <Button href="/contact" variant="secondary">
          Start a project
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
