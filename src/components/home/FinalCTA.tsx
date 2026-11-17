import { Button } from "@/components/ui/Button";
export function FinalCTA() {
  return (
    <section className="final-cta">
      <div>
        <h2>What do you need to build?</h2>
        <p>
          Describe your business, the task you want to change, or the product
          you have in mind. We’ll review your message, reply with any questions,
          and agree on the next step.
        </p>
      </div>
      <Button href="/contact#contact-title">Tell us what you need</Button>
    </section>
  );
}
