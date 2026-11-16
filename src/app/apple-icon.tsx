import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/ui/Logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f5ef",
        border: "8px solid #c0c0c0",
      }}
    >
      <BrandMark width={152} height={122} />
    </div>,
    size,
  );
}
