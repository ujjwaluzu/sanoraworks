import assert from "node:assert/strict";
import { test } from "node:test";
import { canPlay, explainers, LOOP_DURATION, stageAt, STAGE_DURATION } from "../src/lib/service-explainer.ts";
import { beats, serviceAnimations, settledFrame } from "../src/lib/service-animation.ts";
import { services } from "../src/data/services.ts";

test("each existing service has five stages and a fifteen-second loop", () => {
  assert.equal(LOOP_DURATION, 15_000);
  for (const service of services) assert.equal(explainers[service.slug].stages.length, 5);
  for (let i = 0; i < 5; i++) {
    assert.equal(stageAt(i * STAGE_DURATION).index, i);
    assert.equal(stageAt((i + 1) * STAGE_DURATION - .1).index, i);
  }
  assert.deepEqual(stageAt(LOOP_DURATION), { index: 0, progress: 0 });
});
test("animation tracks have valid ordered offsets and no conflicting targets", () => {
  for (const service of services) {
    const tracks = serviceAnimations[service.slug];
    assert.ok(tracks.length > 5);
    assert.equal(new Set(tracks.map((track) => track.part)).size, tracks.length);
    for (const { frames } of tracks) {
      let previous = 0;
      for (const frame of frames) {
        const offset = frame.offset ?? previous;
        assert.ok(offset >= previous && offset >= 0 && offset <= 1);
        previous = offset;
      }
      const state = (frame: Keyframe) => Object.fromEntries(Object.entries(frame).filter(([key]) => !["offset", "easing"].includes(key)));
      assert.deepEqual(state(frames[0]), state(frames.at(-1)!), "loop endpoints must have identical states");
      assert.ok(frames.every((frame) => typeof frame.easing === "string"), "each action declares its easing");
    }
  }
});
test("settled frames fall inside each scene's finished hold", () => {
  const timelines = [beats.software, beats.product, beats.ai, beats.cloud];
  services.forEach((service, i) => {
    assert.ok(settledFrame[service.slug] >= timelines[i].hold);
    assert.ok(settledFrame[service.slug] < timelines[i].reset);
  });
});
test("automatic playback requires intersection, a visible tab and allowed motion", () => {
  for (const visible of [false, true]) for (const hidden of [false, true]) for (const reduced of [false, true]) {
    assert.equal(canPlay({ visible, hidden, reduced }), visible && !hidden && !reduced);
  }
});
