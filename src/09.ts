// import { testInput as input } from "./09-input";
import { input } from "./09-input";
import { IPosition, posToString } from "./utils/position2D";

export function doIt() {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split(" "))
    .map(([dir, count]) => ({ dir, count: +count }));
  let H: IPosition = { x: 0, y: 0 };
  let Ts: IPosition[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  const visited = new Set([posToString(Ts[0])]);
  parsed.forEach(({ dir, count }) => {
    for (let i = 0; i < count; i++) {
      switch (dir) {
        case "R":
          H.x += 1;
          break;
        case "L":
          H.x -= 1;
          break;
        case "U":
          H.y -= 1;
          break;
        case "D":
          H.y += 1;
          break;
      }
      let cH = H;
      for (let j = 0; j < Ts.length; j++) {
        Ts[j] = follow(cH, Ts[j]);
        cH = Ts[j];
      }
      visited.add(posToString(Ts[Ts.length - 1]));
      //   console.log(H, ...Ts);
    }
  });
  const first = visited.size;
  const second = parsed.length;
  console.log(first, second);
}

function follow(H: IPosition, T: IPosition): IPosition {
  if (H.x - T.x > 1 && H.y - T.y > 1) {
    return { x: H.x - 1, y: H.y - 1 };
  }
  if (H.x - T.x > 1 && H.y - T.y < -1) {
    return { x: H.x - 1, y: H.y + 1 };
  }
  if (H.x - T.x < -1 && H.y - T.y > 1) {
    return { x: H.x + 1, y: H.y - 1 };
  }
  if (H.x - T.x < -1 && H.y - T.y < -1) {
    return { x: H.x + 1, y: H.y + 1 };
  }
  if (H.x - T.x > 1) {
    return { x: H.x - 1, y: H.y };
  }
  if (H.x - T.x < -1) {
    return { x: H.x + 1, y: H.y };
  }
  if (H.y - T.y > 1) {
    return { x: H.x, y: H.y - 1 };
  }
  if (H.y - T.y < -1) {
    return { x: H.x, y: H.y + 1 };
  }
  return T;
}
