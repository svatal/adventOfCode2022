// import { testInput as input } from "./09-input";
import { input } from "./09-input";
import { IPosition, posToString } from "./utils/position2D";
import { prefillArray } from "./utils/util";

export function doIt() {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split(" "))
    .map(([dir, count]) => ({ dir, count: +count }));
  let H: IPosition = { x: 0, y: 0 };
  const Ts: IPosition[] = prefillArray(9, () => ({ x: 0, y: 0 }));
  const visited = prefillArray(9, (i) => new Set([posToString(Ts[i])]));
  parsed.forEach(({ dir, count }) => {
    for (let i = 0; i < count; i++) {
      H = step(H, dir);
      let previous = H;
      for (let j = 0; j < Ts.length; j++) {
        Ts[j] = follow(previous, Ts[j]);
        visited[j].add(posToString(Ts[j]));
        previous = Ts[j];
      }
    }
  });
  const first = visited[0].size;
  const second = visited[visited.length - 1].size;
  console.log(first, second);
}

function step({ x, y }: IPosition, dir: string): IPosition {
  switch (dir) {
    case "R":
      return { x: x + 1, y };
    case "L":
      return { x: x - 1, y };
    case "U":
      return { x, y: y + 1 };
    case "D":
      return { x, y: y - 1 };
    default:
      throw `Unexpected direction: ${dir}`;
  }
}

function follow(H: IPosition, T: IPosition): IPosition {
  const dx = H.x - T.x;
  const dy = H.y - T.y;
  if (Math.abs(dx) > 1 && Math.abs(dy) > 1) {
    return { x: H.x - Math.sign(dx), y: H.y - Math.sign(dy) };
  }
  if (Math.abs(dx) > 1) {
    return { x: H.x - Math.sign(dx), y: H.y };
  }
  if (Math.abs(dy) > 1) {
    return { x: H.x, y: H.y - Math.sign(dy) };
  }
  return T;
}
