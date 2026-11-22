import { randomUUID } from "node:crypto";
// Session-only community progress. Likes unlock future questions, never a winner.
export class Engagement {
  constructor(goal = 1000) {
    this.session = randomUUID();
    this.goal = goal;
    this.hearts = 0;
    this.nextGoal = goal;
    this.queue = 0;
    this.goalEvent = null;
    this.serial = 0;
    this.completed = 0;
    this.segmentScores = new Map();
    this.progress = new Map();
    this.summary = null;
    this.seenLikes = new Set();
    this.lastFinished = 0;
    this.demoHearts = false;
    this.cachedTop = null;
  }
  setGoal(goal) {
    if (goal === this.goal) return;
    this.goal = goal;
    this.nextGoal = this.hearts + goal;
  }
  like(count, msgId, demo = false) {
    if (!Number.isSafeInteger(count) || count <= 0 || count > 1000000)
      return false;
    if (msgId && msgId !== "0") {
      if (this.seenLikes.has(msgId)) return false;
      this.seenLikes.add(msgId);
      if (this.seenLikes.size > 50000)
        this.seenLikes.delete(this.seenLikes.values().next().value);
    }
    this.hearts += count;
    this.demoHearts ||= demo;
    if (this.hearts >= this.nextGoal) {
      const unlocked =
        1 + Math.floor((this.hearts - this.nextGoal) / this.goal);
      this.queue += unlocked;
      this.nextGoal += unlocked * this.goal;
      this.goalEvent = { id: ++this.serial, unlocked };
    }
    return true;
  }
  begin() {
    if (this.completed > 0 && this.completed % 10 === 0) {
      this.segmentScores.clear();
      this.cachedTop = null;
    }
    const boosted = this.queue > 0;
    if (boosted) this.queue--;
    return boosted;
  }
  correct(p, round, points, beforeRank, rank, firstPoint) {
    const previous = this.progress.get(p.id),
      streak = previous?.round === round - 1 ? previous.streak + 1 : 1;
    const fast = previous?.fast || streak >= 3;
    this.progress.set(p.id, { round, streak, fast });
    const row = this.segmentScores.get(p.id) || {
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: 0,
      order: 0,
    };
    Object.assign(row, {
      name: p.name,
      avatar: p.avatar,
      score: row.score + points,
      order: p.order,
      badges: fast ? ["Nhanh trí"] : [],
    });
    this.segmentScores.set(p.id, row);
    this.cachedTop = null;
    const comeback =
      !firstPoint &&
      beforeRank > 1 &&
      (rank === 1 || (beforeRank > 3 && rank <= 3));
    return {
      firstPoint,
      streak,
      badges: fast ? ["Nhanh trí"] : [],
      milestone: comeback
        ? "comeback"
        : streak === 3
          ? "streak"
          : firstPoint
            ? "first"
            : null,
    };
  }
  top() {
    if (this.cachedTop) return this.cachedTop;
    return (this.cachedTop = [...this.segmentScores.values()]
      .sort(
        (a, b) =>
          b.score - a.score || a.order - b.order || a.id.localeCompare(b.id),
      )
      .slice(0, 10)
      .map((p) => ({ ...p })));
  }
  finish(round, now) {
    if (this.lastFinished === round) return false;
    this.lastFinished = round;
    this.completed++;
    if (this.completed % 10) return false;
    this.summary = {
      id: ++this.serial,
      number: this.completed / 10,
      round,
      visibleAt: now + 6500,
      leaders: this.top().slice(0, 3),
    };
    return true;
  }
  snapshot(round) {
    return {
      session: this.session,
      hearts: this.hearts,
      goal: this.goal,
      progress: this.hearts - (this.nextGoal - this.goal),
      queuedBoosts: this.queue,
      goalEvent: this.goalEvent,
      segment: {
        number:
          Math.floor(
            Math.max(
              0,
              this.completed -
                (this.lastFinished === round && round > 0 ? 1 : 0),
            ) / 10,
          ) + 1,
        question:
          this.lastFinished === round && round > 0
            ? ((this.completed - 1) % 10) + 1
            : (this.completed % 10) + 1,
        completed: this.completed,
        top: this.top(),
      },
      summary: this.summary,
    };
  }
}
