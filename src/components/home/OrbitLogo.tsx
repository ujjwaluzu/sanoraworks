import { BrandMark } from "@/components/ui/Logo";
import { useId } from "react";

// Clipping is confined to transparent gaps in the supplied 437 × 299 PNG.
// The assembled layers reproduce the original pixels, without tracing the logo.
const upper = "polygon(190px 0px, 437px 0px, 437px 55px, 382px 55px, 350px 111px, 330px 110px, 329px 89px, 311px 60px, 251px 55px, 190px 55px)";
const lower = "polygon(0px 159px, 71px 159px, 71px 178px, 48px 211px, 28px 242px, 32px 259px, 70px 263px, 163px 239px, 197px 239px, 197px 299px, 0px 299px)";

export function OrbitLogo() {
  const lettersMask = `banner-sw-${useId().replaceAll(":", "")}`;
  return (
    <div className="banner-monogram" aria-hidden="true">
      <div className="orbit-logo-art">
        <BrandMark className="banner-logo-source" />
        <svg className="orbit-logo-layers" viewBox="0 0 437 299" focusable="false">
          <defs>
            <mask id={lettersMask} maskUnits="userSpaceOnUse" x="0" y="0" width="437" height="299">
              <rect width="437" height="299" fill="white" />
              <rect width="437" height="299" fill="black" style={{ clipPath: upper }} />
              <rect width="437" height="299" fill="black" style={{ clipPath: lower }} />
            </mask>
          </defs>
          <g data-orbit="letters" className="orbit-letters">
            <image href="/brand/sanoraworks-mark.png" width="437" height="299" mask={`url(#${lettersMask})`} />
          </g>
          <g data-orbit="upper" className="orbit-curve">
            <image href="/brand/sanoraworks-mark.png" width="437" height="299" style={{ clipPath: upper }} />
          </g>
          <g data-orbit="lower" className="orbit-curve">
            <image href="/brand/sanoraworks-mark.png" width="437" height="299" style={{ clipPath: lower }} />
          </g>
        </svg>
      </div>
    </div>
  );
}
