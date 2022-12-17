// import { testInput as input } from "./17-input";
import { input } from "./17-input";
import { IPosition } from "./utils/position2D";

const shapes = [
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  [[1], [1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
];

export function doIt() {
  const wind = input.split(``).map((symbol) => (symbol === ">" ? 1 : -1));
  const rocks: boolean[][] = [];
  let first = 0;
  let second = 0;
  let windIndex = 0;
  const wiCache: { i: number; size: number }[] = [];
  for (let i = 0; i < 1000000000000; i++) {
    if (i === 2022) first = getHighest(rocks);
    if (i > 0 && i % 5 === 0) {
      const before = wiCache[windIndex];
      const current = { i, size: getHighest(rocks) };
      if (before !== undefined) {
        const period = current.i - before.i;
        const gain = current.size - before.size;
        console.log(before, current, period, gain);
        const remaining = 1000000000000 - i;
        if (remaining % period === 0) {
          const periods = remaining / period;
          const size = current.size + periods * gain;
          second = size;
          break;
        }
      }
      wiCache[windIndex] = current;
    }
    const pattern = shapes[i % 5];
    windIndex = simulate(pattern, rocks, wind, windIndex);
    // console.log(rocks);
  }
  console.log(first, second);
}

function simulate(
  pattern: number[][],
  rocks: boolean[][],
  wind: number[],
  windIndex: number
): number {
  let position = { x: 2, y: getHighest(rocks) + 3 + pattern.length - 1 };
  const parrternWidth = pattern[0].length;
  while (true) {
    const push = wind[windIndex++];
    windIndex %= wind.length;
    const draftPos = {
      x: Math.max(0, Math.min(position.x + push, 7 - parrternWidth)),
      y: position.y,
    };
    position = posIsOk(pattern, draftPos, rocks) ? draftPos : position;
    const fallPos = { x: position.x, y: position.y - 1 };
    if (posIsOk(pattern, fallPos, rocks)) {
      position = fallPos;
    } else {
      commitPatterm(pattern, position, rocks);
      break;
    }
  }
  return windIndex;
}

function getHighest(rocks: boolean[][]) {
  return rocks.length;
}

function posIsOk(
  pattern: number[][],
  position: IPosition,
  rocks: boolean[][]
): boolean {
  if (position.y - pattern.length + 1 < 0) return false;
  return pattern.every((line, dy) =>
    line.every(
      (r, dx) =>
        rocks.length <= position.y - dy ||
        r !== 1 ||
        rocks[position.y - dy][position.x + dx] !== true
    )
  );
}

function commitPatterm(
  pattern: number[][],
  position: IPosition,
  rocks: boolean[][]
) {
  pattern.forEach((line, dy) => {
    line.forEach((r, dx) => {
      const x = position.x + dx;
      const y = position.y - dy;
      if (rocks[y] === undefined) {
        rocks[y] = [];
      }
      if (r === 1) rocks[y][x] = true;
    });
  });
}
