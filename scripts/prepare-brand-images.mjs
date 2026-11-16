import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

/** Export from the supplied, star-free bitmap; never redraw the user's lettering. */
export async function prepareBrandImages(folder) {
  const source = await readFile(new URL("sanoraworks-logo-source.png", folder));
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  function bounds(minX, maxX) {
    let left = info.width, top = info.height, right = 0, bottom = 0;
    for (let y = 0; y < info.height; y++) for (let x = minX; x < maxX; x++) {
      if (data[(y * info.width + x) * 4 + 3] < 4) continue;
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
    left = Math.max(minX, left - 4); top = Math.max(0, top - 4);
    right = Math.min(maxX - 1, right + 4); bottom = Math.min(info.height - 1, bottom + 4);
    return { left, top, width: right - left + 1, height: bottom - top + 1 };
  }
  const sources = {};
  for (const [kind, minX, maxX] of [["logo", 0, info.width], ["mark", 0, 710], ["lettering", 770, info.width]]) {
    const crop = await sharp(source).extract(bounds(minX, maxX)).png().toBuffer();
    for (const variant of ["color", "white", "black"]) {
      let bytes = crop;
      if (variant !== "color") {
        const { data: pixels, info: meta } = await sharp(crop).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        for (let i = 0; i < pixels.length; i += 4) pixels[i] = pixels[i + 1] = pixels[i + 2] = variant === "white" ? 255 : 0;
        bytes = await sharp(pixels, { raw: { width: meta.width, height: meta.height, channels: 4 } }).png().toBuffer();
      }
      const filename = `sanoraworks-${kind}${variant === "color" ? "" : `-${variant}`}.png`;
      await writeFile(new URL(filename, folder), bytes);
      sources[`${kind}-${variant}`] = `data:image/png;base64,${bytes.toString("base64")}`;
    }
  }
  return sources;
}
