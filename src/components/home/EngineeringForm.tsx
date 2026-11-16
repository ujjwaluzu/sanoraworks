import { BrandMark } from "@/components/ui/Logo";
export function EngineeringForm({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`workshop-banner ${compact ? "banner-compact" : ""}`}
      aria-hidden="true"
    >
      <div className="pixel-computer">
        <svg
          viewBox="0 0 160 120"
          shapeRendering="crispEdges"
          focusable="false"
        >
          <path d="M16 8h120v78H16z" fill="#777" />
          <path d="M16 8h120v5H21v68h-5z" fill="#fff" />
          <path d="M21 13h110v63H21z" fill="#bfbfbf" />
          <path d="M28 20h96v50H28z" fill="#002f39" />
          <path d="M28 20h96v3H31v47h-3z" fill="#080e21" />
          <path
            d="M40 33h15v4H40zm0 8h32v3H40zm0 8h48v3H40zm0 8h24v3H40z"
            fill="#73d3c0"
          />
          <path
            d="m94 33 9 9-9 9h-5l9-9-9-9zm-18 0-9 9 9 9h5l-9-9 9-9z"
            fill="#fff"
          />
          <path d="M109 80h8v3h-8z" fill="#006666" />
          <path d="M60 86h33v10H60z" fill="#999" />
          <path d="M49 96h55v6H49z" fill="#eee" />
          <path d="M14 107h119l13 9H2z" fill="#ddd" />
          <path d="M2 116h144v4H2z" fill="#777" />
          <path d="M22 109h99v2H22zm-9 4h120v2H13z" fill="#888" />
          <path d="M142 91h10v15h-10z" fill="#eee" />
          <path
            d="M147 85v6m0-6h-9v-7"
            stroke="#666"
            fill="none"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="workshop-banner-copy">
        <span className="mono">THE SANORAWORKS WORKSHOP</span>
        <strong>
          Thoughtfully built.
          <br />
          Ready for what’s next.
        </strong>
        <div className="capability-labels">
          <span>SOFTWARE</span>
          <span>PRODUCTS</span>
          <span>AI & AUTOMATION</span>
          <span>CLOUD</span>
        </div>
      </div>
      <div className="banner-orbit">
        <BrandMark />
      </div>
    </div>
  );
}
