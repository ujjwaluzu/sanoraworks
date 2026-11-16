import { ImageResponse } from "next/og";
import { socialSvg } from "@/lib/brand-artwork";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SanoraWorks ? Practical technology. Built for your business.";

export default function BrandImage() {
  const svg = socialSvg("share");
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
