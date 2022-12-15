// import { testInput as input } from "./15-input";
import { input } from "./15-input";
import { IPosition } from "./utils/position2D";

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
  let startTime = Date.now();
  const examineY = 2000000;
  //   const examineY = 10;
  const f = new Set<number>();
  const occupied = new Set(
    [...parsed.map((p) => p.sensor), ...parsed.map((p) => p.beacon)]
      .filter((p) => p.y === examineY)
      .map((p) => p.x)
  );
  function add(x: number) {
    if (!occupied.has(x)) f.add(x);
  }
  parsed.forEach(({ sensor, beacon }) => {
    const safeDist = dist(sensor, beacon);
    const rowDist = Math.abs(sensor.y - examineY);
    for (let i = 0; i <= safeDist - rowDist; i++) {
      add(sensor.x + i);
      add(sensor.x - i);
    }
  });
  console.log("first", f.size, "time:", Date.now() - startTime);
  startTime = Date.now();
  for (let y = 0; y <= 2 * examineY; y++) {
    for (let x = 0; x <= 2 * examineY; ) {
      const position = { x, y };
      const remainingDist = Math.max(
        ...parsed.map(
          (p) => dist(p.sensor, p.beacon) - dist(p.sensor, position)
        )
      );
      if (remainingDist < 0) {
        console.log(
          "second",
          position,
          position.x * 2 * examineY + position.y,
          "time",
          Date.now() - startTime
        );
        return;
      }
      x += remainingDist + 1;
    }
  }
}

function dist(p1: IPosition, p2: IPosition) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}
