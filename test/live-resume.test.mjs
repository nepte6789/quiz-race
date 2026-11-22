import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { Game } from "../server/engine.mjs";
import { LiveLink } from "../server/tiktok.mjs";
function fixture() {
  let now = 1000;
  const clients = [];
  const game = new Game(
    [
      {
        id: "q",
        type: "text",
        category: "Test",
        prompt: "Đồ vật ngồi?",
        answer: "ghế",
      },
    ],
    { now: () => now },
  );
  game.configure({ heartGoal: 100 });
  let fail = false;
  const live = new LiveLink(game, () => {}, {
    maxAttempts: 1,
    createClient: async () => {
      const c = new EventEmitter();
      c.connect = async () => {
        if (fail) throw Error("Rate limited");
        c.isConnected = true;
      };
      c.disconnect = async () => {
        c.isConnected = false;
        c.emit("disconnected");
      };
      clients.push(c);
      return c;
    },
  });
  return {
    game,
    live,
    clients,
    advance: (ms) => (now += ms),
    fail: (v) => (fail = v),
  };
}
const chat = (id, msgId) => ({
  user: { idStr: id, nickname: id },
  comment: "ghe",
  common: { msgId },
});
test("same-channel reconnect freezes the active question and retains rankings, gifts, hearts, streaks and boosts", async () => {
  const { game: g, live, clients, advance } = fixture();
  await live.connect("test");
  g.next();
  clients[0].emit("chat", chat("Lan", "first"));
  g.gift({ id: "Lan", name: "Lan", diamonds: 25 });
  g.like({ count: 250, msgId: "hearts" });
  g.next();
  advance(5000);
  const before = g.snapshot();
  clients[0].emit("disconnected");
  assert(g.snapshot().networkPaused);
  assert.equal(g.snapshot().remaining, 55000);
  advance(120000);
  g.tick();
  assert.equal(g.round, 2);
  assert.equal(g.phase, "question");
  await live.connect("@TEST");
  const after = g.snapshot();
  assert(!after.networkPaused);
  assert.equal(after.endsAt - after.serverTime, 55000);
  for (const key of [
    "round",
    "roundPoints",
    "roundBoosted",
    "question",
    "topScores",
    "topGifts",
    "stats",
    "engagement",
  ])
    assert.deepEqual(after[key], before[key], key);
  clients[0].emit("chat", chat("old-client", "stale"));
  assert.equal(g.accepted, 1);
  clients[1].emit("chat", chat("Lan", "first"));
  assert.equal(g.accepted, 1);
  clients[1].emit("chat", chat("Lan", "second"));
  assert.equal(g.accepted, 2);
  assert.equal(g.winners[0].streak, 2);
  await live.disconnect();
});
test("failed retry does not consume time or discard the held question", async () => {
  const { game: g, live, clients, advance, fail } = fixture();
  await live.connect("test");
  g.next();
  advance(7000);
  clients[0].emit("error", Error("temporary warning"));
  assert(!g.connectionHold);
  clients[0].isConnected = false;
  clients[0].emit("error", Error("network timeout"));
  assert(g.connectionHold);
  fail(true);
  advance(30000);
  await live.connect("test");
  assert.equal(live.state.status, "error");
  assert.equal(g.snapshot().remaining, 53000);
  advance(60000);
  g.tick();
  assert.equal(g.round, 1);
  fail(false);
  await live.connect("test");
  assert.equal(g.endsAt - g.now(), 53000);
  await live.disconnect();
});
test("held end-of-segment podium retains its phase, winners and remaining award time", async () => {
  const { game: g, live, clients, advance } = fixture();
  await live.connect("test");
  for (let i = 0; i < 10; i++) {
    g.next();
    clients[0].emit("chat", chat("Lan", "m" + i));
  }
  advance(7000);
  const summary = structuredClone(g.engagement.summary),
    event = structuredClone(g.lastEvent),
    winner = structuredClone(g.winners);
  const left = g.nextAt - g.now();
  clients[0].emit("disconnected");
  advance(200000);
  g.tick();
  assert.equal(g.round, 10);
  await live.connect("test");
  assert.equal(g.nextAt - g.now(), left);
  assert.equal(g.engagement.summary.id, summary.id);
  assert.equal(g.engagement.summary.visibleAt, summary.visibleAt + 200000);
  assert.deepEqual(g.lastEvent, event);
  assert.deepEqual(g.winners, winner);
  await live.disconnect();
});
test("manual pause survives reconnect; explicit new question can leave a held session for offline testing", async () => {
  const { game: g, live, clients, advance } = fixture();
  await live.connect("test");
  g.next();
  advance(9000);
  g.pause();
  const left = g.remaining;
  clients[0].emit("disconnected");
  advance(60000);
  await live.connect("test");
  assert(g.paused);
  assert.equal(g.remaining, left);
  g.pause();
  assert.equal(g.endsAt - g.now(), left);
  await live.disconnect();
  assert(g.connectionHold);
  g.next();
  assert(!g.connectionHold);
  assert.equal(g.phase, "question");
  assert(g.comment({ id: "demo:a", name: "Test", text: "ghe" }));
});
