// import { testInput as input } from "./14-input";
import { input } from "./14-input";
import { posToString } from "./utils/position2D";

enum Tile {
  Rock,
  Sand,
}

export function doIt() {
  const parsed = input.split(`\n`).map((line) =>
    line
      .split(" -> ")
      .map((p) => p.split(",").map((x) => +x))
      .map(([x, y]) => ({ x, y }))
  );
  let maxY = 0;
  const cave = new Map<string, Tile>();
  parsed.forEach((l) => {
    let start = l.shift();
    if (start !== undefined) {
      cave.set(posToString(start), Tile.Rock);
      while (true) {
        maxY = Math.max(maxY, start.y);
        let end = l.shift();
        // console.log(start, end);
        if (end === undefined) return;
        const dX = end.x - start.x;
        const dY = end.y - start.y;
        const max = Math.max(Math.abs(dX), Math.abs(dY));
        for (let i = 1; i <= max; i++) {
          cave.set(
            posToString({
              x: start.x + (i * dX) / max,
              y: start.y + (i * dY) / max,
            }),
            Tile.Rock
          );
        }
        start = end;
      }
    }
  });
  let didNotFall = true;
  let sand = 0;
  let first = 0;
  while (didNotFall) {
    let current = { x: 500, y: 0 };
    if (cave.has(posToString(current))) break;
    while (true) {
      if (!cave.has(posToString({ x: current.x, y: current.y + 1 }))) {
        current.y++;
      } else if (
        !cave.has(posToString({ x: current.x - 1, y: current.y + 1 }))
      ) {
        current.x--;
        current.y++;
      } else if (
        !cave.has(posToString({ x: current.x + 1, y: current.y + 1 }))
      ) {
        current.x++;
        current.y++;
      } else {
        cave.set(posToString(current), Tile.Sand);
        sand++;
        break;
      }
      if (current.y > maxY) {
        if (first === 0) {
          first = sand;
        }
        if (cave.has(posToString(current))) {
          didNotFall = false;
          break;
        } else {
          cave.set(posToString(current), Tile.Sand);
          sand++;
          break;
        }
      }
    }
  }
  const second = sand;
  console.log(first, second);
}
