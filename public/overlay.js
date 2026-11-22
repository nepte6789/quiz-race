import {
  WinnerSpeaker,
  winnerText,
  questionText,
  podiumText,
} from "./speech.js";
import { cheerleader } from "./chibi.js";
import { createRoamers, stepRoamers } from "./roaming.js";
const $ = (id) => document.getElementById(id),
  mute = new URLSearchParams(location.search).get("audio") === "0";
let state,
  offset = 0,
  retry = 500,
  boardKey = "",
  questionKey = "",
  lastEvent = "",
  audio,
  cheerTimer,
  animation = 0;
const runners = Array.from({ length: 3 }, (_, i) => {
  const runner = document.createElement("div");
  runner.className = "mascot-runner";
  runner.id = i ? `mascotRunner${i}` : "mascotRunner";
  runner.style.setProperty("--phase", `${-i * 0.27}s`);
  const bubble = document.createElement("span");
  bubble.className = "cheer-bubble";
  bubble.textContent = "Cố lên nào! ♡";
  if (!i) bubble.id = "cheerBubble";
  const art = document.createElement("div");
  art.className = "mascot-facing";
  art.innerHTML = cheerleader(i);
  runner.append(bubble, art);
  $("mascotTrack").append(runner);
  return runner;
});
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
function roamBounds() {
  return {
    left: 25,
    right: 925,
    top: document.querySelector(".boards").offsetTop + 100,
    bottom: 1700,
  };
}
const roamLimits = roamBounds(),
  faces = runners.map((runner) => runner.querySelector(".mascot-facing"));
let actors = createRoamers(roamLimits),
  roamFrame = 0,
  lastFrame = 0;
function placeActors() {
  actors.forEach((a, i) => {
    runners[i].style.transform = `translate3d(${a.x}px,${a.y}px,0)`;
    faces[i].style.setProperty("--direction", a.direction);
    runners[i].classList.toggle("over-board", a.y < roamLimits.top + 500);
  });
}
function roam(now) {
  const dt = lastFrame ? (now - lastFrame) / 1000 : 0;
  lastFrame = now;
  stepRoamers(
    actors,
    dt,
    roamLimits,
    Math.random,
    runners[0].classList.contains("cheering") || state?.networkPaused,
  );
  placeActors();
  if (!reducedMotion.matches) roamFrame = requestAnimationFrame(roam);
}
function motionPreference() {
  cancelAnimationFrame(roamFrame);
  lastFrame = 0;
  if (!reducedMotion.matches) roamFrame = requestAnimationFrame(roam);
  else {
    actors = createRoamers(roamLimits, () => 0.5);
    placeActors();
  }
}
reducedMotion.addEventListener("change", motionPreference);
placeActors();
motionPreference();
function fit() {
  const scale = Math.min(innerWidth / 1080, innerHeight / 1920);
  $("stage").style.transform = `scale(${scale})`;
  $("stage").style.left = `${Math.max(0, (innerWidth - 1080 * scale) / 2)}px`;
}
addEventListener("resize", fit);
fit();
const speaker = new WinnerSpeaker({
  muted: mute,
  status: (text) => ($("voiceStatus").textContent = text),
});
function readQuestion() {
  if (state?.phase === "question" && !state.paused && state.settings.speech)
    speaker.speak({
      key: `question:${state.round}:${state.settings.voice}`,
      kind: "question",
      round: state.round,
      voice: state.settings.voice,
      text: questionText(state.question),
    });
}
$("enableAudio").hidden = mute;
$("enableAudio").onclick = async () => {
  speaker.enable();
  readQuestion();
  try {
    audio = new AudioContext();
    await audio.resume();
  } catch {}
  $("enableAudio").hidden = true;
};
function portrait(parent, p, cls = "avatar") {
  const a = document.createElement("span");
  a.className = cls;
  a.textContent = p?.name?.[0] || "★";
  if (/^https:\/\//.test(p?.avatar || "")) {
    const img = document.createElement("img");
    img.src = p.avatar;
    img.referrerPolicy = "no-referrer";
    img.onerror = () => {
      img.remove();
      a.textContent = p?.name?.[0] || "★";
    };
    a.replaceChildren(img);
  }
  parent.append(a);
}
function board(id, rows, metric) {
  const fragment = document.createDocumentFragment();
  if (!rows.length) {
    const li = document.createElement("li");
    li.className = "empty-board";
    li.textContent =
      metric === "score" ? "Chờ người mở điểm" : "Chưa có quà tặng";
    fragment.append(li);
  }
  rows.forEach((p, i) => {
    const li = document.createElement("li"),
      rank = document.createElement("span"),
      name = document.createElement("span"),
      value = document.createElement("b");
    rank.className = "rank";
    rank.textContent = i + 1;
    name.className = "player-name";
    name.textContent = p.name;
    if (p.badges?.length) {
      const badge = document.createElement("small");
      badge.className = "player-badge";
      badge.textContent = "⚡ Nhanh trí";
      name.append(badge);
    }
    value.className = "player-value";
    value.textContent =
      Intl.NumberFormat("vi-VN").format(p[metric]) +
      (metric === "diamonds" ? " xu" : "");
    li.append(rank);
    portrait(li, p);
    li.append(name, value);
    fragment.append(li);
  });
  $(id).replaceChildren(fragment);
}
const inner = document.createElement("div");
inner.className = "view-inner";
inner.append(...$("questionView").childNodes);
$("questionView").append(inner);
function fitQuestion() {
  const h = inner.scrollHeight;
  inner.style.transform = `scale(${Math.min(1, 345 / Math.max(1, h))})`;
}
document.fonts.ready.then(() => {
  if (state) fitQuestion();
});
function paintQuestion() {
  const s = state,
    q = s.question,
    reveal = s.phase === "reveal",
    key = JSON.stringify([s.round, s.phase, s.paused, q, s.winners]);
  if (key === questionKey) return;
  questionKey = key;
  $("typeLabel").textContent = s.paused
    ? "TẠM DỪNG"
    : q?.type === "choice"
      ? "CHỌN A · B · C · D"
      : q?.type === "math"
        ? "TÍNH NHANH"
        : "GỢI Ý";
  $("prompt").textContent =
    s.phase === "idle" ? "Sẵn sàng thử tài?" : q?.prompt || "";
  $("prompt").style.fontSize =
    q?.prompt?.length > 250
      ? "26px"
      : q?.prompt?.length > 110
        ? "31px"
        : "36px";
  for (const id of ["answerSlots", "letters", "options"])
    $(id).replaceChildren();
  $("scrambleLabel").classList.add("hidden");
  $("solvedLine").classList.toggle("hidden", !reveal || !s.winners.length);
  if (s.phase === "idle") {
    $("answerHelp").textContent =
      "Bấm Bắt đầu để mở câu hỏi · Chibi đã sẵn sàng cổ vũ!";
    fitQuestion();
    return;
  }
  const w = s.winners[0];
  $("solvedLine").textContent = w
    ? `🏆 ${w.name} trả lời đúng! +${w.points} điểm`
    : "";
  if (!["choice", "math"].includes(q.type)) {
    const groups = reveal
      ? String(q.answer)
          .normalize("NFC")
          .toLocaleUpperCase("vi")
          .split(/\s+/)
          .map((word) =>
            Array.from(
              new Intl.Segmenter("vi", { granularity: "grapheme" }).segment(
                word,
              ),
              (x) => x.segment,
            ),
          )
      : q.letterGroups || (q.scrambled ? [q.scrambled] : []);
    $("questionCard").classList.toggle("compact", groups.flat().length > 18);
    $("scrambleLabel").classList.toggle("hidden", reveal);
    for (const group of groups) {
      const word = document.createElement("span");
      word.className = "answer-word";
      for (const letter of group) {
        const slot = document.createElement("span");
        slot.className = "answer-slot" + (reveal ? " correct" : "");
        if (reveal) slot.textContent = letter;
        else slot.setAttribute("aria-hidden", "true");
        word.append(slot);
      }
      $("answerSlots").append(word);
    }
    if (!reveal)
      for (const group of q.letterGroups ||
        (q.scrambled ? [q.scrambled] : [])) {
        const word = document.createElement("span");
        word.className = "scrambled-word";
        for (const letter of group) {
          const tile = document.createElement("span");
          tile.className = "letter";
          tile.textContent = letter;
          word.append(tile);
        }
        $("letters").append(word);
      }
  } else if (q.type === "choice")
    q.options.forEach((option, i) => {
      const el = document.createElement("div"),
        label = document.createElement("b");
      el.className =
        "option" + (reveal ? (option === q.answer ? " correct" : " dim") : "");
      label.textContent = "ABCD"[i];
      el.append(label, document.createTextNode(option));
      $("options").append(el);
    });
  else if (reveal) {
    const el = document.createElement("span");
    el.className = "answer-slot correct";
    el.style.width = "auto";
    el.style.minWidth = "100px";
    el.style.padding = "0 24px";
    el.textContent = q.answer;
    $("answerSlots").append(el);
  }
  $("answerHelp").textContent = reveal
    ? "Cùng chờ câu tiếp theo nhé!"
    : q.type === "choice"
      ? "👉 Bình luận A, B, C, D hoặc nội dung đáp án"
      : `👉 Gõ đáp án vào bình luận – nhanh nhất được điểm!${q.letterGroups ? ` (${q.letterGroups.flat().length} chữ cái)` : ""}`;
  if (reveal && w) {
    $("winnerAvatar").replaceChildren();
    portrait($("winnerAvatar"), w, "winner-portrait");
    $("winnerName").textContent = w.name;
    $("solution").textContent = q.answer.toLocaleUpperCase("vi");
    $("scoreChip").textContent =
      `+${w.points} điểm · Tổng ${w.score}${w.rank ? ` · Hạng #${w.rank}` : ""}`;
  }
  fitQuestion();
}
function ding() {
  if (!audio || mute || !state.settings.sound) return;
  [660, 880, 1100].forEach((f, i) => {
    const oscillator = audio.createOscillator(),
      gain = audio.createGain(),
      t = audio.currentTime + i * 0.1;
    oscillator.frequency.value = f;
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(t);
    oscillator.stop(t + 0.25);
  });
}
function celebrate(event) {
  clearTimeout(cheerTimer);
  runners.forEach((runner) => runner.classList.add("cheering"));
  runners.forEach((runner, i) => {
    runner.querySelector(".cheer-bubble").textContent = [
      event.community ? "CẢ PHÒNG MỞ CÂU ×2! ♡" : `Hoan hô ${event.name}! 🌸`,
      "Giỏi quá! Vỗ tay nào! ♡",
      "Tuyệt vời! Tung bông thôi! ✿",
    ][i];
  });
  $("mascotTrack").setAttribute(
    "aria-label",
    `Ba chibi tung bông chúc mừng ${event.name}`,
  );
  ding();
  cheerTimer = setTimeout(() => {
    runners.forEach((runner) => runner.classList.remove("cheering"));
    $("cheerBubble").textContent = "Đến lượt bạn tỏa sáng! ♡";
  }, 4500);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = $("confetti"),
    ctx = canvas.getContext("2d");
  canvas.width = 1080;
  canvas.height = 1920;
  cancelAnimationFrame(animation);
  const stageBox = $("stage").getBoundingClientRect(),
    scale = stageBox.width / 1080;
  const origins = runners.map((runner) => {
    const box = runner.getBoundingClientRect();
    return {
      x: (box.x + box.width / 2 - stageBox.x) / scale,
      y: (box.y + box.height / 3 - stageBox.y) / scale,
    };
  });
  const pieces = Array.from({ length: 95 }, (_, i) => {
    const petal = i < 54;
    const origin = origins[i % 3];
    return {
      x: petal ? origin.x + (Math.random() - 0.5) * 60 : Math.random() * 1080,
      y: petal ? origin.y : 280 - Math.random() * 400,
      v: petal ? -9 - Math.random() * 9 : 4 + Math.random() * 6,
      vx: petal ? (Math.random() - 0.5) * 8 : 0,
      color: ["#ffe273", "#ff7ad3", "#7df0be", "#bca0ff"][
        Math.floor(Math.random() * 4)
      ],
      petal,
    };
  });
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, 1080, 1920);
    for (const p of pieces) {
      p.y += p.v;
      if (p.petal) {
        p.v += 0.14;
        p.x += p.vx;
      } else p.x += Math.sin(p.y / 70) * 2;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.petal) ctx.ellipse(p.x, p.y, 7, 3, p.y / 50, 0, Math.PI * 2);
      else ctx.rect(p.x, p.y, 10, 5);
      ctx.fill();
    }
    if (++frame < 210) animation = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, 1080, 1920);
  }
  draw();
}
let communityEvent = 0,
  momentKey = "",
  podiumKey = "",
  celebratedPodium = "",
  momentUntil = 0;
function paintCommunity(s, first) {
  const e = s.engagement;
  if (!e) return;
  $("communityHeartLabel").textContent =
    `♡ CẢ PHÒNG ĐÃ THẢ ${e.hearts.toLocaleString("vi-VN")} TIM`;
  $("heartCount").textContent =
    `${e.progress.toLocaleString("vi-VN")} / ${e.goal.toLocaleString("vi-VN")}`;
  $("heartFill").style.width = `${Math.min(100, (e.progress / e.goal) * 100)}%`;
  $("heartReward").textContent =
    s.roundBoosted && s.phase === "question"
      ? "✦ CÂU ĐẶC BIỆT ĐANG NHÂN ĐÔI ĐIỂM"
      : e.queuedBoosts
        ? `ĐÃ MỞ ${e.queuedBoosts} CÂU ×2 · CẢM ƠN CẢ PHÒNG!`
        : "Đạt mục tiêu → câu kế nhân đôi điểm";
  document
    .querySelector(".community-bar")
    .classList.toggle(
      "unlocked",
      !!e.queuedBoosts || (s.roundBoosted && s.phase === "question"),
    );
  $("segmentName").textContent = `CHẶNG ${e.segment.number}`;
  $("segmentQuestion").textContent = `${e.segment.question} / 10`;
  $("specialStatus").textContent =
    s.phase === "reveal" && s.winners[0]?.streak
      ? `⚡ CHUỖI ĐÚNG ${s.winners[0].streak}${s.winners[0].streak < 3 ? " / 3" : " · NHANH TRÍ"}`
      : s.roundBoosted
        ? "✦ ĐIỂM ×2"
        : "MỖI CHẶNG MỘT CƠ HỘI";
  $("questionCard").classList.toggle("special-round", !!s.roundBoosted);
  if (e.goalEvent && communityEvent !== e.goalEvent.id) {
    communityEvent = e.goalEvent.id;
    if (!first) celebrate({ name: "cả phòng", community: true });
  }
  const w = s.winners[0];
  if (s.phase === "reveal" && w?.milestone) {
    const key = `${s.round}:${w.id}`;
    if (key !== momentKey) {
      momentKey = key;
      const themes = {
        first: ["✦", "GHI ĐIỂM ĐẦU TIÊN", "Chào ngôi sao mới của cả phòng!"],
        streak: [
          "⚡",
          "DANH HIỆU NHANH TRÍ",
          "Đúng 3 câu liên tiếp · Quá xuất sắc!",
        ],
        comeback: ["♛", "MÀN LỘI NGƯỢC DÒNG", `Bứt phá lên hạng #${w.rank}!`],
      };
      const t = themes[w.milestone];
      $("momentIcon").textContent = t[0];
      $("momentLabel").textContent = t[1];
      $("momentName").textContent = w.name;
      $("momentCaption").textContent = t[2];
      momentUntil = Date.now() + offset + (first ? 0 : 4500);
    }
  }
  const summary = e.summary;
  if (summary && podiumKey !== summary.id) {
    podiumKey = summary.id;
    $("podiumTitle").textContent = `VINH DANH CHẶNG ${summary.number}`;
    $("podiumRows").replaceChildren();
    if (!summary.leaders.length) {
      const empty = document.createElement("p");
      empty.className = "empty-podium";
      empty.textContent = "Chặng mới là cơ hội để bạn mở điểm!";
      $("podiumRows").append(empty);
    }
    summary.leaders.forEach((p, i) => {
      const card = document.createElement("article"),
        rank = document.createElement("span"),
        name = document.createElement("strong"),
        points = document.createElement("b");
      card.className = `podium-person place-${i + 1}`;
      rank.textContent = ["♛ HẠNG NHẤT", "② HẠNG NHÌ", "③ HẠNG BA"][i];
      card.append(rank);
      portrait(card, p, "podium-avatar");
      name.textContent = p.name;
      points.textContent = `${p.score} điểm`;
      card.append(name, points);
      $("podiumRows").append(card);
    });
  }
}
function render(s) {
  const first = !state;
  if (
    state &&
    (s.round !== state.round ||
      s.phase !== state.phase ||
      s.paused !== state.paused ||
      s.networkPaused !== state.networkPaused ||
      s.settings.voice !== state.settings.voice)
  ) {
    speaker.stop();
    $("voiceStatus").textContent = "";
  }
  if (
    state &&
    (s.round < state.round ||
      s.engagement?.session !== state.engagement?.session)
  ) {
    speaker.reset();
    celebratedPodium = "";
    communityEvent = 0;
    momentKey = "";
    podiumKey = "";
    momentUntil = 0;
  }
  state = s;
  offset = s.serverTime - Date.now();
  const leader = s.topScores[0];
  $("liveTitle").textContent = leader?.name || s.settings.title;
  $("liveTitle").parentElement.classList.toggle("marquee", !!leader);
  $("round").textContent = s.round;
  $("pointBadge").textContent =
    `${s.roundBoosted && s.phase !== "idle" ? "✦ ×2 · " : ""}Đúng +${s.phase === "idle" ? s.settings.points : (s.roundPoints ?? s.settings.points)} điểm`;
  $("category").textContent = s.question?.category || "";
  $("liveSubtitle").textContent = s.settings.subtitle;
  $("playerCount").textContent = s.stats.players;
  $("connection").textContent = s.networkPaused
    ? "⏸ Giữ nguyên buổi · chờ nối lại LIVE"
    : s.live.status === "connected"
      ? `● LIVE @${s.live.username}`
      : ["connecting", "retrying"].includes(s.live.status)
        ? "◌ Đang nối TikTok"
        : "○ Chưa nối TikTok";
  paintQuestion();
  paintCommunity(s, first);
  const segmentRows = s.engagement?.segment.top || [];
  $("segmentBoardNumber").textContent =
    `CHẶNG ${s.engagement?.segment.number || 1}`;
  const bk = JSON.stringify([s.topScores, s.topGifts, segmentRows]);
  if (bk !== boardKey) {
    boardKey = bk;
    board("scores", s.topScores, "score");
    board("gifts", s.topGifts.slice(0, 5), "diamonds");
    board("segmentScores", segmentRows.slice(0, 5), "score");
  }
  const w = s.winners[0];
  $("ticker").classList.toggle("result", s.phase === "reveal" && !!w);
  $("ticker").textContent =
    s.phase === "reveal" && w
      ? `✅ ${w.name} trả lời đúng ${s.question.answer} · +${w.points} điểm (tổng ${w.score})`
      : "💬 Gõ đáp án vào bình luận để ghi điểm · Tặng quà để lên bảng vàng 🎁";
  if (s.event) {
    const key = `${s.round}:${s.event.id}`;
    if (key !== lastEvent) {
      lastEvent = key;
      if (!first) celebrate(s.event);
    }
  }
  readQuestion();
  if (
    s.phase === "reveal" &&
    w &&
    s.settings.speech &&
    !s.networkPaused &&
    !(
      s.engagement?.summary?.round === s.round &&
      Date.now() + offset >= s.engagement.summary.visibleAt
    )
  ) {
    const key = `winner:${s.round}:${w.id}:${s.settings.voice}`;
    if (first) speaker.remember(key);
    else
      speaker.speak({
        key,
        round: s.round,
        voice: s.settings.voice,
        text: winnerText(s.question.answer, w.name),
      });
  }
  if (!s.settings.speech || s.phase === "idle") {
    speaker.stop();
    $("voiceStatus").textContent = "";
  }
  clock();
}
function clock() {
  if (!state) return;
  const s = state,
    now = s.networkPaused ? s.holdAt : Date.now() + offset,
    left =
      s.phase === "question"
        ? s.paused
          ? s.remaining
          : s.endsAt - now
        : s.phase === "reveal" && s.settings.auto
          ? s.nextAt - now
          : 0;
  const summary = s.engagement?.summary;
  const showPodium =
    s.phase === "reveal" &&
    summary?.round === s.round &&
    now >= summary.visibleAt;
  $("podium").classList.toggle("hidden", !showPodium);
  $("podiumScrim").classList.toggle("hidden", !showPodium);
  if (showPodium && celebratedPodium !== summary.id) {
    celebratedPodium = summary.id;
    if (now - summary.visibleAt < 1500)
      celebrate({ name: summary.leaders[0]?.name || "cả phòng", podium: true });
  }
  $("momentCard").classList.toggle(
    "hidden",
    now >= momentUntil || s.phase !== "reveal" || showPodium,
  );
  if (showPodium) {
    $("podiumNext").textContent = s.settings.auto
      ? `Chặng mới bắt đầu sau ${Math.max(0, Math.ceil(left / 1000))} giây`
      : "Sẵn sàng chặng mới · Chờ người dẫn mở câu";
    if (s.settings.speech && !s.networkPaused)
      speaker.speak({
        key: `podium:${summary.id}:${s.settings.voice}`,
        kind: "podium",
        round: s.round,
        voice: s.settings.voice,
        text: podiumText(summary),
      });
  }
  const popup =
    !showPodium &&
    s.phase === "reveal" &&
    !!s.winners.length &&
    now < (s.revealedAt ?? s.nextAt - s.settings.breakTime * 1000) + 2000;
  $("winnerView").classList.toggle("hidden", !popup);
  $("timer").textContent = s.paused
    ? "Ⅱ"
    : s.phase === "idle"
      ? "—"
      : s.phase === "reveal"
        ? "✓"
        : Math.max(0, Math.ceil(left / 1000));
  $("timer").style.setProperty(
    "--progress",
    `${Math.max(0, Math.min(100, (left / ((s.phase === "reveal" ? Math.max(1, (s.nextAt - s.revealedAt) / 1000) : (s.roundDuration ?? s.settings.duration)) * 1000)) * 100))}%`,
  );
  $("timeFill").style.width =
    `${Math.max(0, Math.min(100, (left / ((s.phase === "reveal" ? Math.max(1, (s.nextAt - s.revealedAt) / 1000) : (s.roundDuration ?? s.settings.duration)) * 1000)) * 100))}%`;
  $("nextQuestion").textContent = s.settings.auto
    ? `Câu mới sau ${Math.max(0, Math.ceil(left / 1000))} giây`
    : "Chờ mở câu mới";
}
function connect() {
  const ws = new WebSocket(
    `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`,
  );
  ws.onopen = () => (retry = 500);
  ws.onmessage = (e) => {
    try {
      const s = JSON.parse(e.data);
      if (s.t === "state") render(s);
    } catch (error) {
      console.error("Cập nhật sân khấu thất bại", error);
    }
  };
  ws.onclose = () => {
    speaker.stop();
    $("connection").textContent = "○ Mất máy chủ · đang nối lại";
    setTimeout(connect, retry);
    retry = Math.min(10000, retry * 1.7);
  };
}
connect();
setInterval(clock, 100);
