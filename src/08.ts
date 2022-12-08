// import { testInput as input } from "./08-input";
import { input } from "./08-input";

export function doIt() {
  const parsed = input.split(`\n`).map((line) => line.split("").map((t) => +t));
  let visible = 0;
  let maxScore = 0;
  console.log(parsed);
  for (let y = 0; y < parsed.length; y++) {
    const line = parsed[y];
    for (let x = 0; x < line.length; x++) {
      const current = parsed[y][x];
      if (
        isVisible(parsed, current, 0, x, y, true) ||
        isVisible(parsed, current, x + 1, line.length, y, true) ||
        isVisible(parsed, current, 0, y, x, false) ||
        isVisible(parsed, current, y + 1, parsed.length, x, false)
      )
        visible++;
      const s1 = getScore(parsed, current, x - 1, 0, y, true, true);
      const s2 = getScore(parsed, current, x + 1, line.length, y, true, false);
      const s3 = getScore(parsed, current, y - 1, 0, x, false, true);
      const s4 = getScore(
        parsed,
        current,
        y + 1,
        parsed.length,
        x,
        false,
        false
      );
      const score = s1 * s2 * s3 * s4;
      console.log(current, x, y, score, s1, s2, s3, s4);
      maxScore = Math.max(maxScore, score);
    }
  }
  const first = visible;
  const second = maxScore;
  console.log(first, second);
}

function isVisible(
  parsed: number[][],
  lowerThan: number,
  from: number,
  to: number,
  other: number,
  isX: boolean
): boolean {
  for (let i = from; i < to; i++) {
    const current = isX ? parsed[other][i] : parsed[i][other];
    if (current >= lowerThan) {
      return false;
    }
  }
  return true;
}

function getScore(
  parsed: number[][],
  lowerThan: number,
  from: number,
  to: number,
  other: number,
  isX: boolean,
  backwards: boolean
): number {
  let score = 0;
  if (!backwards) {
    for (let i = from; i < to; i++) {
      const current = isX ? parsed[other][i] : parsed[i][other];
      score++;
      if (current >= lowerThan) {
        return score;
      }
    }
  } else {
    for (let i = from; i >= to; i--) {
      const current = isX ? parsed[other][i] : parsed[i][other];
      score++;
      if (current >= lowerThan) {
        return score;
      }
    }
  }
  return score;
}
