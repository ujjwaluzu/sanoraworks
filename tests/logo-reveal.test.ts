import assert from "node:assert/strict";
import { test } from "node:test";
import { logoRevealTracks, REVEAL_DURATION, REVEAL_STILL } from "../src/lib/logo-reveal.ts";

test("logo reveal tracks reset seamlessly and reserve a finished hold", () => {
  assert.equal(REVEAL_DURATION, 12000);
  assert.ok(REVEAL_STILL >= 5900 && REVEAL_STILL < 10100);
  assert.equal(new Set(logoRevealTracks.map(({ part }) => part)).size, logoRevealTracks.length);
  for (const { part, frames } of logoRevealTracks) {
    const state = (frame: Keyframe) => Object.fromEntries(Object.entries(frame).filter(([key]) => !["offset", "easing"].includes(key)));
    assert.deepEqual(state(frames[0]), state(frames.at(-1)!), `${part}: matching loop endpoints`);
    assert.equal(frames[0].offset, 0);
    assert.equal(frames.at(-1)!.offset, 1);
    frames.forEach((frame, i) => {
      assert.ok(frame.offset! >= (frames[i - 1]?.offset ?? 0) && frame.offset! <= 1);
      assert.ok(frame.easing);
    });
  }
});
