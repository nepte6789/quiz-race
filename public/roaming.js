// Coordinates are stage pixels, independent of preview/browser scaling.
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export function createRoamers(bounds, rng = Math.random) {
  return Array.from({ length: 3 }, (_, i) => ({
    x: bounds.left + (bounds.right - bounds.left) * [0.06, 0.49, 0.93][i],
    y: bounds.top + (bounds.bottom - bounds.top) * [0.2, 0.85, 0.45][i],
    targetX: bounds.left + rng() * (bounds.right - bounds.left),
    targetY: bounds.top + rng() * (bounds.bottom - bounds.top),
    speed: 58 + i * 11,
    wait: 0,
    direction: 1,
  }));
}
export function stepRoamers(
  actors,
  seconds,
  bounds,
  rng = Math.random,
  paused = false,
) {
  const dt = clamp(seconds, 0, 0.08);
  for (const a of actors) {
    a.x = clamp(a.x, bounds.left, bounds.right);
    a.y = clamp(a.y, bounds.top, bounds.bottom);
    a.targetX = clamp(a.targetX, bounds.left, bounds.right);
    a.targetY = clamp(a.targetY, bounds.top, bounds.bottom);
    if (paused) continue;
    if (a.wait > 0) {
      a.wait -= dt;
      continue;
    }
    let dx = a.targetX - a.x,
      dy = a.targetY - a.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 12) {
      a.targetX = bounds.left + rng() * (bounds.right - bounds.left);
      a.targetY = bounds.top + rng() * (bounds.bottom - bounds.top);
      a.wait = 0.15 + rng() * 0.7;
      continue;
    }
    let vx = (dx / distance) * a.speed,
      vy = (dy / distance) * a.speed;
    // Gentle separation, so three independent paths do not stack into one model.
    for (const other of actors) {
      if (other === a) continue;
      const ox = a.x - other.x,
        oy = a.y - other.y,
        d = Math.hypot(ox, oy);
      if (d > 0 && d < 150) {
        vx += (ox / d) * (150 - d) * 1.1;
        vy += (oy / d) * (150 - d) * 1.1;
      }
    }
    const speed = Math.hypot(vx, vy),
      factor = Math.min(1, (a.speed * 1.5) / Math.max(speed, 1));
    vx *= factor;
    vy *= factor;
    a.x = clamp(a.x + vx * dt, bounds.left, bounds.right);
    a.y = clamp(a.y + vy * dt, bounds.top, bounds.bottom);
    if (Math.abs(vx) > 4) a.direction = vx < 0 ? -1 : 1;
  }
  return actors;
}
