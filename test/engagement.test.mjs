import test from "node:test";
import assert from "node:assert/strict";
import { Game } from "../server/engine.mjs";
function fixture() {
  let time = 1000;
  const g = new Game(
    [
      {
        id: "a",
        type: "text",
        category: "Test",
        prompt: "Đồ để ngồi?",
        answer: "ghế",
      },
    ],
    { now: () => time },
  );
  g.configure({ auto: false, heartGoal: 100 });
  return {
    g,
    advance: (ms) => (time += ms),
    win: (id = "a", name = "Lan") => g.comment({ id, name, text: "ghe" }),
  };
}
test("collective likes deduplicate, queue future boosts and never assign a winner", () => {
  const { g, win } = fixture();
  g.next();
  assert.equal(g.roundPoints, 1);
  assert(g.like({ count: 100, msgId: "h1" }));
  assert(!g.like({ count: 100, msgId: "h1" }));
  assert.equal(g.engagement.queue, 1);
  assert.equal(g.winners.length, 0);
  assert.equal(g.roundPoints, 1);
  win();
  assert.equal(g.winners[0].points, 1);
  g.next();
  assert(g.roundBoosted);
  assert.equal(g.roundPoints, 2);
  win();
  assert.equal(g.winners[0].score, 3);
  g.next();
  assert(!g.roundBoosted);
  assert.equal(g.roundPoints, 1);
});
test("multiple thresholds queue exactly once, goal edits do not grant retroactive bonuses", () => {
  const { g } = fixture();
  g.like({ count: 250 });
  assert.equal(g.engagement.queue, 2);
  assert.equal(g.snapshot().engagement.progress, 50);
  g.configure({ heartGoal: 200 });
  assert.equal(g.snapshot().engagement.progress, 0);
  assert.equal(g.engagement.queue, 2);
  for (const count of [0, -2, 1.5, NaN, 1000001]) assert(!g.like({ count }));
});
test("three consecutive wins award a lasting title; skipped/unanswered rounds break the streak", () => {
  const { g, win } = fixture();
  for (let i = 0; i < 3; i++) {
    g.next();
    win();
  }
  assert.equal(g.winners[0].streak, 3);
  assert.equal(g.winners[0].milestone, "streak");
  assert.deepEqual(g.winners[0].badges, ["Nhanh trí"]);
  g.next();
  g.reveal();
  g.next();
  win();
  assert.equal(g.winners[0].streak, 1);
  assert.deepEqual(g.top("score")[0].badges, ["Nhanh trí"]);
});
test("a newcomer gets first-point celebration and an established player can mount a comeback", () => {
  const { g, win } = fixture();
  g.next();
  win("b", "B");
  assert.equal(g.winners[0].milestone, "first");
  g.next();
  win("a", "A");
  g.like({ count: 100 });
  g.next();
  win("a", "A");
  assert.equal(g.winners[0].milestone, "comeback");
  assert.equal(g.winners[0].rank, 1);
});
test("ten completed questions produce a frozen podium, extend the break, then reset only segment points", () => {
  const { g, win, advance } = fixture();
  for (let i = 0; i < 10; i++) {
    g.next();
    win(i < 6 ? "a" : "b", i < 6 ? "Lan" : "Mai");
    advance(50);
  }
  const s = g.snapshot();
  assert.equal(s.engagement.summary.number, 1);
  assert.equal(s.engagement.summary.leaders[0].score, 6);
  assert.equal(s.engagement.summary.leaders[1].score, 4);
  assert(g.nextAt - g.revealedAt >= 18000);
  assert.equal(s.engagement.segment.question, 10);
  g.next();
  const next = g.snapshot();
  assert.equal(next.engagement.segment.number, 2);
  assert.equal(next.engagement.segment.top.length, 0);
  assert.equal(next.topScores[0].score, 6);
  win("c", "Người mới");
  assert.equal(g.engagement.top()[0].id, "c");
  assert.equal(s.engagement.summary.leaders[0].score, 6);
});
test("timeout and manual skip count once; reset clears all session engagement and real connection clears demos", () => {
  const { g, win } = fixture();
  g.next();
  g.reveal();
  g.reveal();
  assert.equal(g.engagement.completed, 1);
  g.next();
  g.next();
  assert.equal(g.engagement.completed, 2);
  win("demo:a");
  g.like({ count: 100, demo: true });
  g.setLive(true);
  assert.equal(g.engagement.hearts, 0);
  assert(!g.players.has("demo:a"));
  g.reset();
  const e = g.snapshot().engagement;
  assert.equal(e.hearts, 0);
  assert.equal(e.segment.completed, 0);
  assert.equal(e.summary, null);
  assert.equal(g.round, 0);
});
test("like-only updates reuse cached rankings; scoring and gift changes invalidate the right tables", () => {
  const { g, win } = fixture();
  g.next();
  win();
  const top = g.top("score"),
    segment = g.engagement.top();
  g.like({ count: 10 });
  assert.equal(g.top("score"), top);
  assert.equal(g.engagement.top(), segment);
  g.gift({ id: "b", name: "Mai", diamonds: 10 });
  assert.equal(g.top("diamonds")[0].id, "b");
  g.next();
  win();
  assert.equal(g.top("score")[0].score, 2);
  assert.notEqual(g.top("score"), top);
  assert.notEqual(g.engagement.top(), segment);
});
