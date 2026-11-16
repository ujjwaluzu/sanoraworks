import { readFile } from "node:fs/promises";
import path from "node:path";
import type { BrandSources } from "./brand-artwork";

/** Keep raster bytes out of the JS bundle; metadata reads the committed exports. */
export async function readBrandSources(): Promise<BrandSources> {
  const entries = await Promise.all(
    ["logo", "mark", "lettering"].flatMap((kind) =>
      ["color", "white", "black"].map(async (variant) => {
        const file = `sanoraworks-${kind}${variant === "color" ? "" : `-${variant}`}.png`;
        const bytes = await readFile(path.join(process.cwd(), "public/brand", file));
        return [`${kind}-${variant}`, `data:image/png;base64,${bytes.toString("base64")}`];
      }),
    ),
  );
  return Object.fromEntries(entries);
}
