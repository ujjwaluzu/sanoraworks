import sharp from 'sharp';
// Lossless responsive derivatives preserve the supplied logo and its PNG fallback.
for (const suffix of ['', '-white', '-black']) {
  for (const width of [340, 640]) {
    const input = `public/brand/sanoraworks-logo${suffix}.png`;
    const output = `public/brand/sanoraworks-logo${suffix}-${width}.webp`;
    await sharp(input).resize({ width }).webp({ lossless: true, effort: 6 }).toFile(output);
    console.log(output);
  }
}
