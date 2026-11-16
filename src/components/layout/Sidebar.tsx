import Link from "next/link";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export function Sidebar() {
  return (
    <aside className="site-sidebar" aria-label="Workshop directory">
      <section className="sidebar-box">
        <h2>
          <span aria-hidden="true">▤</span> Service directory
        </h2>
        <ul className="sidebar-links">
          {services.map((item) => (
            <li key={item.slug}>
              <Link href={`/services#${item.slug}`}>
                <span aria-hidden="true">›</span>
                {item.shortTitle}
              </Link>
            </li>
          ))}
        </ul>
        <p className="sidebar-footnote">
          From first idea to a dependable system.
        </p>
      </section>
      <section className="sidebar-box">
        <h2>
          <span aria-hidden="true">▧</span> Project index
        </h2>
        <ul className="sidebar-links project-index">
          {projects.map((item, index) => (
            <li key={item.slug}>
              <Link href={`/work/${item.slug}`}>
                <span className="mono" aria-hidden="true">
                  0{index + 1}
                </span>
                <span>
                  {item.name}
                  <small>{item.category}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link className="sidebar-all" href="/work">
          Browse all projects →
        </Link>
      </section>
      <section className="sidebar-box about-workshop">
        <h2>About the workshop</h2>
        <p>
          We’re an independent technology and engineering company. We turn
          complex challenges into practical digital solutions.
        </p>
        <Link href="/about">Meet SanoraWorks →</Link>
      </section>
      <div className="sidebar-note">
        <strong>A good place to start.</strong>
        <p>Have a problem to solve or an idea to explore?</p>
        <Link href="/contact">Tell us about your project →</Link>
      </div>
      {(site.email || site.github || site.linkedin) && (
        <section className="sidebar-box sidebar-connect">
          <h2>Connect</h2>
          {site.email && (
            <a href={`mailto:${site.email}`}>Email the workshop</a>
          )}
          {site.github && (
            <a href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          )}
          {site.linkedin && (
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          )}
        </section>
      )}
      <p className="sidebar-colophon mono">
        THOUGHTFULLY BUILT.
        <br />
        ALWAYS A WORK IN PROGRESS.
      </p>
    </aside>
  );
}
