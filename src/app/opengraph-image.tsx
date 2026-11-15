import { ImageResponse } from "next/og";

export const alt =
  "Sanora Works — Engineering the next. Independent technology and engineering.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "58px 68px",
          background: "#101312",
          color: "#edeee7",
          backgroundImage:
            "radial-gradient(ellipse at 90% 30%, #2d382a, #101312 65%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            fontSize: 26,
            letterSpacing: -1,
          }}
        >
          <svg width="42" height="42" viewBox="0 0 40 40">
            <path
              d="M10 5h23L16 22H4L21 5M30 35H7l17-17h12L19 35"
              fill="#d1dbc7"
            />
          </svg>
          <span style={{ fontWeight: 700 }}>SANORA WORKS</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 70,
            fontSize: 13,
            letterSpacing: 3,
            color: "#a7b69b",
          }}
        >
          INDEPENDENT TECHNOLOGY & ENGINEERING
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            lineHeight: 1.08,
            letterSpacing: -5,
            marginTop: 22,
          }}
        >
          <span>Engineering</span>
          <span style={{ color: "#a5b199" }}>the next.</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #46523e",
            paddingTop: 22,
            marginTop: "auto",
            fontSize: 14,
            color: "#a9b79e",
          }}
        >
          <span>Ideas. Architecture. Purposeful execution.</span>
          <span>sanoraworks.com ↗</span>
        </div>
      </div>
    ),
    size,
  );
}
