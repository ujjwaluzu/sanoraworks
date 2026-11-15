import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container">
        <div className="cta-top">
          <p className="eyebrow">
            <span className="status-dot" />
            Let’s build what’s next
          </p>
          <span className="mono">IDEA → POSSIBILITY → REALITY</span>
        </div>
        <h2>
          Have an idea
          <br />
          <span>worth engineering?</span>
        </h2>
        <div className="cta-bottom">
          <p>
            Let’s discuss your next digital product,
            <br />
            business challenge or technology project.
          </p>
          <Button href="/contact">Start a conversation</Button>
        </div>
      </div>
    </section>
  );
}
