import test from "node:test";
import assert from "node:assert/strict";
import { createRoamers, stepRoamers } from "../public/roaming.js";
const bounds = { left: 25, right: 925, top: 970, bottom: 1700 };
test("three roamers start apart and stay below the board heading over long runs", () => {
  let seed = 13;
  const rng = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const actors = createRoamers(bounds, rng);
  assert.equal(actors.length, 3);
  const start = actors.map((a) => [a.x, a.y]);
  for (let i = 0; i < 18000; i++) {
    stepRoamers(actors, 1 / 60, bounds, rng);
    for (const a of actors) {
      assert(a.x >= bounds.left && a.x <= bounds.right);
      assert(a.y >= bounds.top && a.y <= bounds.bottom);
      assert(Number.isFinite(a.x + a.y));
    }
  }
  assert(
    actors.every(
      (a, i) => Math.hypot(a.x - start[i][0], a.y - start[i][1]) > 20,
    ),
  );
  assert.notEqual(actors[0].targetX, actors[1].targetX);
});
test("celebration freezes travel and resumes afterwards, without a big background-tab jump", () => {
  const actors = createRoamers(bounds, () => 0.4),
    before = structuredClone(actors);
  stepRoamers(actors, 10, bounds, () => 0.4, true);
  assert.deepEqual(actors, before);
  stepRoamers(actors, 100, bounds, () => 0.4);
  assert(actors.some((a, i) => a.x !== before[i].x));
  for (let i = 0; i < 3; i++)
    assert(
      Math.hypot(actors[i].x - before[i].x, actors[i].y - before[i].y) < 12,
    );
});
