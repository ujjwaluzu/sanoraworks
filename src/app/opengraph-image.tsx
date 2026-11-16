import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/ui/Logo";
import { brandLettering } from "@/lib/brand-paths";

export const alt =
  "SanoraWorks — Engineering the next. An independent technology and engineering workshop.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 38,
        background: "#004f52",
        color: "#17232c",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          background: "#c0c0c0",
          border: "3px solid #ffffff",
          padding: 12,
          boxShadow: "8px 8px 0 #002f3b",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#006666",
            padding: "12px 18px",
            color: "white",
            fontSize: 19,
            fontWeight: 700,
          }}
        >
          <span>SanoraWorks / Independent engineering workshop</span>
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              background: "#c0c0c0",
              border: "2px solid #ffffff",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginTop: 12,
            padding: "34px 42px",
            background: "#ffffff",
            border: "2px solid #808080",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <BrandMark width={130} height={104} />
            <svg width="470" height="96" viewBox="0 0 300 60">
              <path fill="#002f49" d={brandLettering.Sanora.path} />
              <path
                fill="#006666"
                transform={`translate(${brandLettering.Sanora.width} 0)`}
                d={brandLettering.Works.path}
              />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            Engineering the next.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 24,
              lineHeight: 1.5,
            }}
          >
            Thoughtful software. Sound systems. Purposeful execution.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
              paddingTop: 26,
              borderTop: "1px solid #a7b7b7",
              fontSize: 18,
            }}
          >
            <span style={{ color: "#006666", fontWeight: 700 }}>
              PRODUCTS · PLATFORMS · ENGINEERING
            </span>
            <span style={{ color: "#0000ee" }}>sanoraworks.com →</span>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
