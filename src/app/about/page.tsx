import { UserRound } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";
import { BrandMark } from "@/components/ui/Logo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Principles } from "@/components/home/Principles";
import { Approach } from "@/components/home/Approach";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata = pageMetadata(
  "About Us",
  "Sanora Works is an independent technology and engineering company built around research, architecture, innovation, and purposeful execution.",
  "/about",
);

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="The company behind the work"
        index="03"
        title={
          <>
            Independent thinking.
            <br />
            <span>Purposeful engineering.</span>
          </>
        }
        description="We are Sanora Works. An independent technology and engineering company with a simple belief: the most useful technology starts with a real purpose."
      />
      <section className="section">
        <div className="container">
          <div className="about-intro">
            <div>
              <p className="eyebrow">Engineering the next.</p>
              <h2>
                Building technology
                <br />
                that moves things
                <br />
                forward.
              </h2>
              <p>
                SANORA WORKS develops digital solutions, software products, and
                intelligent systems. Our approach brings research, architecture,
                engineering, and innovation together to make complex challenges
                more practical.
              </p>
              <p>
                We don’t just build what’s required today. We think about what
                will be needed tomorrow, without losing sight of what matters
                now.
              </p>
            </div>
            <div className="brand-object">
              <BrandMark />
              <span className="mono">SANORA WORKS / INDEPENDENT BY DESIGN</span>
            </div>
          </div>
          <div className="mission-grid">
            <article>
              <p className="eyebrow">01 / Our mission</p>
              <h2>
                Turn meaningful challenges
                <br />
                into useful technology.
              </h2>
              <p>
                To design and engineer practical digital solutions that help
                people and businesses move forward, with clear thinking,
                reliable foundations, and purposeful execution.
              </p>
            </article>
            <article>
              <p className="eyebrow">02 / Our vision</p>
              <h2>
                Build for what’s next.
                <br />
                Keep purpose at the centre.
              </h2>
              <p>
                To grow an independent engineering company recognised for
                thoughtful products, intelligent systems, and a lasting
                commitment to making technology useful.
              </p>
            </article>
          </div>
        </div>
      </section>
      <BrandPhilosophy />
      <Principles />
      <Approach detailed />
      <section className="section">
        <div className="container founders-layout">
          <SectionHeading eyebrow="The people behind the thinking">
            Independent minds.
            <br />A shared direction.
          </SectionHeading>
          <div>
            {site.founders.length ? (
              site.founders.map((founder) => (
                <article className="founder-card" key={founder.name}>
                  <div className="founder-avatar" aria-hidden="true">
                    <UserRound size={25} strokeWidth={1} />
                  </div>
                  <div>
                    <h3>{founder.name}</h3>
                    <span className="eyebrow">{founder.role}</span>
                    <p>{founder.bio}</p>
                  </div>
                </article>
              ))
            ) : (
              <article className="founder-card">
                <div className="founder-avatar" aria-hidden="true">
                  <UserRound size={25} strokeWidth={1} />
                </div>
                <div>
                  <h3>Founder profile</h3>
                  <span className="eyebrow">To be introduced</span>
                  <p>
                    We’ll share the people behind Sanora Works here. Founder
                    names, roles, and biographies will be published once
                    confirmed.
                  </p>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
