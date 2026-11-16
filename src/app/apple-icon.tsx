import { readBrandSources } from "@/lib/brand-server";
import { ImageResponse } from "next/og";
import { appleIconSvg } from "@/lib/brand-artwork";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function BrandImage() {
  const sources = await readBrandSources();
  const svg = appleIconSvg(sources);
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      {/* The supplied raster logo is embedded without changing its lettering. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`}
        width={size.width} height={size.height} alt="" />
    </div>,
    size,
  );
}
