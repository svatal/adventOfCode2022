// import { testInput as input } from "./15-input";
import { input } from "./15-input";
import { logEvery } from "./utils/log";
import { IPosition, posToString } from "./utils/position2D";

export function doIt() {
  const parsed = input
    .split(`\n`)
    .map((line) =>
      line
        .split(":")
        .map((s) => s.split(",").map((x) => +x.split("=")[1]))
        .map(([x, y]) => ({ x, y }))
    )
    .map(([sensor, beacon]) => ({ sensor, beacon }));
  const examineY = 2000000;
  //   const examineY = 10;
  const f = new Set<number>();
  //   const occupied = new Set(
  //     [...parsed.map((p) => p.sensor), ...parsed.map((p) => p.beacon)]
  //       .filter((p) => p.y === examineY)
  //       .map((p) => p.x)
  //   );
  //   function add(x: number) {
  //     if (!occupied.has(x)) f.add(x);
  //   }
  //   //   console.log(parsed);
  //   parsed.forEach(({ sensor, beacon }) => {
  //     const safeDist = dist(sensor, beacon);
  //     const rowDist = Math.abs(sensor.y - examineY);
  //     for (let i = 0; i <= safeDist - rowDist; i++) {
  //       add(sensor.x + i);
  //       add(sensor.x - i);
  //     }
  //   });
  const first = f.size;
  let found = false;
  for (let y = /*2500*/ 400000; y <= 4000000; y++) {
    for (let x = 0; x <= 4000000; ) {
      const position = { x, y };
      const remainingDist = Math.max(
        ...parsed.map(
          (p) => dist(p.sensor, p.beacon) - dist(p.sensor, position)
        )
      );
      if (remainingDist < 0) {
        console.log(position);
        return;
      }
      x += remainingDist + 1;
      //   found = parsed.every(
      //     ({ sensor, beacon }) => dist(sensor, beacon) < dist(sensor, position)
      //   );
      //   if (found) {
      //     console.log(position);
      //     return;
      //   }
    }
    if (y % 1000000 === 0) console.log(y);
  }
  const second = parsed.length;
  console.log(first, second);
}

function dist(p1: IPosition, p2: IPosition) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}
