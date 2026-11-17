import { Button } from "@/components/ui/Button";
import { EngineeringForm } from "./EngineeringForm";
export function Hero() {
  return (
    <section className="home-welcome">
      <h1>Websites for your business. Software for your next product.</h1>
      <p className="welcome-intro">
        SanoraWorks builds websites, internal tools, and web applications for
        business owners and startup founders. Bring us a workflow your team does
        by hand or a product idea you want to test.
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
