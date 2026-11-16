import { BrandMark } from "@/components/ui/Logo";
export function EngineeringForm({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`workshop-banner ${compact ? "banner-compact" : ""}`}
    >
      <div className="pixel-computer" aria-hidden="true">
        <svg
          viewBox="0 0 160 120"
          shapeRendering="crispEdges"
          focusable="false"
        >
          <path d="M16 8h120v78H16z" fill="var(--line-strong)" />
          <path d="M16 8h120v5H21v68h-5z" fill="var(--white)" />
          <path d="M21 13h110v63H21z" fill="var(--silver)" />
          <path d="M28 20h96v50H28z" fill="var(--ink)" />
          <path d="M28 20h96v3H31v47h-3z" fill="var(--black)" />
          <path
            d="M40 33h15v4H40zm0 8h32v3H40zm0 8h48v3H40zm0 8h24v3H40z"
            fill="var(--cobalt-line)"
          />
          <path
            d="m94 33 9 9-9 9h-5l9-9-9-9zm-18 0-9 9 9 9h5l-9-9 9-9z"
            fill="var(--white)"
          />
          <path d="M109 80h8v3h-8z" fill="var(--cobalt)" />
          <path d="M60 86h33v10H60z" fill="var(--line-strong)" />
          <path d="M49 96h55v6H49z" fill="var(--surface)" />
          <path d="M14 107h119l13 9H2z" fill="var(--silver)" />
          <path d="M2 116h144v4H2z" fill="var(--line-strong)" />
          <path d="M22 109h99v2H22zm-9 4h120v2H13z" fill="var(--line-strong)" />
          <path d="M142 91h10v15h-10z" fill="var(--surface)" />
          <path
            d="M147 85v6m0-6h-9v-7"
            stroke="var(--line-strong)"
            fill="none"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="workshop-banner-copy">
        <h2>Websites, business tools, and automation.</h2>
        <p>
          Reach customers online, organise day-to-day operations, and spend less
          time on repetitive tasks with software built around your business.
        </p>
      </div>
      <div className="banner-monogram" aria-hidden="true">
        <BrandMark />
      </div>
    </div>
  );
}
