import Link from "next/link";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export function Sidebar() {
  return (
    <aside className="site-sidebar" aria-label="SanoraWorks directory">
      <section className="sidebar-box">
        <h2>Services</h2>
        <ul className="sidebar-links">
          {services.map((item) => (
            <li key={item.slug}>
              <Link href={`/services#${item.slug}`}>{item.shortTitle}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="sidebar-box">
        <h2>Projects</h2>
        <ul className="sidebar-links">
          {projects.map((item) => (
            <li key={item.slug}>
              <Link href={`/work/${item.slug}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
        <Link className="sidebar-all" href="/work">All projects →</Link>
      </section>
      <section className="sidebar-box">
        <h2>Contact</h2>
        <ul className="sidebar-links">
          <li><Link href="/contact#contact-title">Tell us what you need</Link></li>
          {site.email && (
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          )}
        </ul>
      </section>
    </aside>
  );
}
