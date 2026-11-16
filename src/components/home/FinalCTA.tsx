import { Button } from "@/components/ui/Button";
export function FinalCTA() {
  return (
    <section className="final-cta">
      <div>
        <h2>Have an idea worth engineering?</h2>
        <p>
          Tell us about your next digital product, business challenge, or
          technology project.
        </p>
      </div>
      <Button href="/contact">Start a conversation</Button>
    </section>
  );
}
