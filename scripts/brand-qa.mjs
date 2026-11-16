import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import sharp from "sharp";
import { brandColors as c } from "../src/lib/brand-colors.ts";

const folder = new URL("../public/brand/", import.meta.url);
const assets = JSON.parse(await readFile(new URL("manifest.json", folder), "utf8"));
for (const asset of assets) {
  const bytes = await readFile(new URL(asset.file, folder));
  if (asset.file.endsWith(".png")) {
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, asset.width, asset.file);
    assert.equal(metadata.height, asset.height, asset.file);
    if (asset.transparent) {
      const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.equal(data[3], 0, `${asset.file}: transparent corner`);
      let opaque = 0;
      for (let i = 3; i < data.length; i += info.channels) if (data[i] >= 200) opaque++;
      assert.ok(opaque > 100, `${asset.file}: visible artwork`);
    }
  } else if (asset.embeddedRaster) {
    assert.match(bytes.toString(), /<image href="data:image\/png;base64,/, asset.file);
    assert.doesNotMatch(bytes.toString(), /<(?:text|foreignObject)\b|font-family/i, asset.file);
  }
}

// Both avatars keep every foreground pixel inside a 512px-radius circular crop.
for (const inverse of [false, true]) {
  const file = `sanoraworks-avatar-${inverse ? "cobalt-on-white" : "white-on-cobalt"}.png`;
  const { data, info } = await sharp(new URL(file, folder).pathname.replace(/^\/(.:)/, "$1")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const background = inverse ? [255, 255, 255] : [36, 87, 255];
  for (let y = 0; y < 1024; y++) for (let x = 0; x < 1024; x++) {
    const i = (y * 1024 + x) * info.channels;
    if (background.some((value, channel) => Math.abs(data[i + channel] - value) > 2)) {
      assert.ok(Math.hypot(x - 511.5, y - 511.5) < 480, `${file}: circle-safe artwork`);
    }
  }
}

const luminance = (hex) => {
  const rgb = hex.slice(1).match(/../g).map((v) => parseInt(v, 16) / 255)
    .map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
for (const [fg, bg] of [["cobalt", "white"], ["cobalt", "silver"], ["white", "cobalt-hover"], ["ink", "silver"], ["muted", "surface"], ["error", "error-soft"]]) {
  assert.ok(contrast(c[fg], c[bg]) >= 4.5, `${fg}/${bg}: readable text contrast`);
}
const css = await readFile(new URL("../src/app/brand-tokens.css", import.meta.url), "utf8");
for (const [key, value] of Object.entries(c)) assert.ok(css.includes(`--${key}: ${value};`), `${key}: CSS palette matches`);
assert.deepEqual(await readFile(new URL("../src/app/icon.svg", import.meta.url)), await readFile(new URL("sanoraworks-favicon.svg", folder)));
assert.deepEqual(await readFile(new URL("../src/app/icon1.png", import.meta.url)), await readFile(new URL("sanoraworks-favicon-32.png", folder)));
for (const file of await readdir(folder)) {
  if (file.endsWith(".svg")) assert.doesNotMatch(await readFile(new URL(file, folder), "utf8"), /#006666|#002f49/i, file);
}
console.log(`Passed ${assets.length} export contracts, transparency, embedded source logos, circular crops, palette synchronization, favicon parity, and text contrast.`);
