import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import WebSocket from "ws";

test("restart clears legacy real-player rankings but preserves preferences and custom bank", async () => {
  const dir = mkdtempSync(join(tmpdir(), "chibi-restart-"));
  const port = 30000 + Math.floor(Math.random() * 10000),
    base = `http://127.0.0.1:${port}`;
  const bank = [
    {
      id: "custom",
      category: "Riêng",
      type: "text",
      prompt: "Câu riêng?",
      answer: "đúng",
      aliases: [],
    },
  ];
  writeFileSync(join(dir, "questions.json"), JSON.stringify(bank));
  writeFileSync(
    join(dir, "state.json"),
    JSON.stringify({
      settings: { voice: "male", duration: 32, auto: false, category: "Riêng" },
      players: [
        {
          id: "real-123",
          name: "Lan",
          score: 99,
          diamonds: 500,
          correct: 10,
          order: 1,
        },
      ],
    }),
  );
  let child, ws;
  async function stop() {
    ws?.terminate();
    if (child && child.exitCode === null) {
      const exited = once(child, "exit");
      child.kill("SIGTERM");
      await exited;
    }
    child = null;
  }
  async function start() {
    child = spawn(process.execPath, ["start.mjs"], {
      env: {
        ...process.env,
        PORT: String(port),
        DATA_DIR: dir,
        HOST: "127.0.0.1",
        ADMIN_TOKEN: "",
        TIKTOK_CHANNEL: "",
        OPEN_BROWSER: "0",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const deadline = Date.now() + 5000;
    let ready = false;
    while (Date.now() < deadline) {
      try {
        ready = (await fetch(base + "/api/health")).ok;
        if (ready) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 30));
    }
    assert(ready, "server ready");
    ws = new WebSocket(`ws://127.0.0.1:${port}/ws?role=control`);
    return await new Promise((resolve, reject) => {
      ws.on("error", reject);
      ws.on("message", (raw) => {
        const m = JSON.parse(raw);
        if (m.t === "state") resolve(m);
      });
    });
  }
  try {
    for (let run = 0; run < 2; run++) {
      const s = await start();
      assert.deepEqual(s.topScores, []);
      assert.deepEqual(s.topGifts, []);
      assert.deepEqual(s.stats, { players: 0, comments: 0, accepted: 0 });
      assert.equal(s.round, 0);
      assert.equal(s.phase, "idle");
      assert.deepEqual(s.winners, []);
      assert.equal(s.event, null);
      assert.equal(s.settings.voice, "male");
      assert.equal(s.settings.duration, 32);
      assert.equal(s.settings.category, "Riêng");
      assert.deepEqual(await (await fetch(base + "/api/bank")).json(), bank);
      await stop();
      assert.deepEqual(
        JSON.parse(readFileSync(join(dir, "state.json"))).players,
        [],
      );
    }
  } finally {
    await stop();
    rmSync(dir, { recursive: true, force: true });
  }
});
