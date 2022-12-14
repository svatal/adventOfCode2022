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
        const distance = Math.max(Math.abs(dX), Math.abs(dY));
        for (let i = 1; i <= distance; i++) {
          cave.set(
            posToString({
              x: start.x + (i * dX) / distance,
              y: start.y + (i * dY) / distance,
            }),
            Tile.Rock
          );
        }
        start = end;
      }
    }
  });
  let sandCount = 0;
  let first: number | undefined = undefined;
  while (true) {
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
        sandCount++;
        break;
      }
      if (current.y > maxY) {
        if (first === undefined) {
          first = sandCount;
        }
        cave.set(posToString(current), Tile.Sand);
        sandCount++;
        break;
      }
    }
  }
  const second = sandCount;
  console.log(first, second);
}
