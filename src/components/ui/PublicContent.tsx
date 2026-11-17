import Link from "next/link";
import { site } from "@/data/site";
import { requirePublicPage, type PublicSection } from "@/data/public-content";

export function ContentSection({ section }: { section: PublicSection }) {
  return (
    <section className="public-copy-section">
      <h2>{section.heading}</h2>
      {section.paragraphs?.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {section.items && (
        <ul className="capability-list">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
export function PageLinks({ path }: { path: string }) {
  return (
    <nav className="public-related" aria-label="Related pages">
      <ul>
        {requirePublicPage(path).links.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export function Breadcrumbs({ path }: { path: string }) {
  const page = requirePublicPage(path);
  if (path === "/") return null;
  const parent = path.startsWith("/services/")
    ? "/services"
    : path.startsWith("/work/")
      ? "/work"
      : null;
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span aria-hidden="true"> / </span>
      {parent && (
        <>
          <Link href={parent}>
            {parent === "/services" ? "Services" : "Work"}
          </Link>
          <span aria-hidden="true"> / </span>
        </>
      )}
      <span aria-current="page">{page.h1}</span>
    </nav>
  );
}
export function PageStructuredData({ path }: { path: string }) {
  const page = requirePublicPage(path);
  const url = `${site.url}${path}`;
  const parent = path.startsWith("/services/")
    ? "/services"
    : path.startsWith("/work/")
      ? "/work"
      : null;
  const crumbs = [
    { name: "Home", item: `${site.url}/` },
    ...(parent
      ? [
          {
            name: parent === "/services" ? "Services" : "Work",
            item: site.url + parent,
          },
        ]
      : []),
    ...(path !== "/" ? [{ name: page.h1, item: url }] : []),
  ];
  const service = path.startsWith("/services/");
  const project = path.startsWith("/work/");
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": page.kind,
        "@id": `${url}#page`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "en",
        dateModified: page.revised,
        isPartOf: { "@id": `${site.url}/#website` },
        about: {
          "@id":
            service || project ? `${url}#subject` : `${site.url}/#organization`,
        },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          ...c,
        })),
      },
      ...(service
        ? [
            {
              "@type": "Service",
              "@id": `${url}#subject`,
              name: page.h1,
              description: page.intro,
              url,
              provider: { "@id": `${site.url}/#organization` },
              serviceType: page.h1,
            },
          ]
        : []),
      ...(project
        ? [
            {
              "@type": "CreativeWork",
              "@id": `${url}#subject`,
              name: page.h1,
              description: page.intro,
              url,
              creativeWorkStatus: page.status,
              creator: { "@id": `${site.url}/#organization` },
              abstract:
                "In development. Previews are illustrative interface concepts. A public product is not available yet.",
            },
          ]
        : []),
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
