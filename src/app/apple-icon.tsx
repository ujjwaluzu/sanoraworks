import { ImageResponse } from "next/og";
import { appleIconSvg } from "@/lib/brand-artwork";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function BrandImage() {
  const svg = appleIconSvg();
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      {/* This image contains only outlined paths; no fonts are loaded. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`}
        width={size.width} height={size.height} alt="" />
    </div>,
    size,
  );
}
