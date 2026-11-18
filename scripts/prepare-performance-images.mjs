import assert from 'node:assert/strict';
import sharp from 'sharp';

// Keep the animation's native geometry and every visible source pixel.
for (const suffix of ['', '-white', '-black']) {
  const input = 'public/brand/sanoraworks-mark' + suffix + '.png';
  const output = 'public/brand/sanoraworks-mark' + suffix + '.webp';
  await sharp(input).webp({ lossless: true, effort: 6 }).toFile(output);
  const original = await sharp(input).ensureAlpha().raw().toBuffer();
  const decoded = await sharp(output).ensureAlpha().raw().toBuffer();
  assert.equal(decoded.length, original.length, output);
  for (let i = 0; i < original.length; i += 4) {
    assert.equal(decoded[i + 3], original[i + 3], output + ': alpha');
    if (original[i + 3]) assert.ok(original.subarray(i, i + 3).equals(decoded.subarray(i, i + 3)), output + ': visible pixels');
  }
}
for (const name of ['slotbreeze', 'proofhuddle', 'enquirywing', 'uptimeperch']) {
  await sharp('public/projects/' + name + '-concept.webp').resize({ width: 320 })
    .webp({ quality: 85, effort: 6 }).toFile('public/projects/' + name + '-concept-320.webp');
}
console.log('Prepared responsive previews; all three lossless marks match the original visible pixels and alpha.');
