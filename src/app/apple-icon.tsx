import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#101112" }}><svg width="120" height="120" viewBox="0 0 40 40"><path d="M10 5h23L16 22H4L21 5M30 35H7l17-17h12L19 35" fill="#d1dbc7" /></svg></div>, size);
}
