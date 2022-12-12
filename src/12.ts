// import { testInput as input } from "./12-input";
import { input } from "./12-input";
import {
  neighbors4,
  posFromString,
  posToString,
  valueInMap,
} from "./utils/position2D";
import { prefillArray } from "./utils/util";

export function doIt() {
  const parsed = input.split(`\n`).map(
    (line) => line.split("") //.map(ch => ch.charCodeAt(0) - 'a'.charCodeAt(0))
  );
  let start = "";
  let target = "";
  const heights: number[][] = prefillArray(parsed.length, () => []);
  const as: string[] = [];
  parsed.forEach((l, y) =>
    l.forEach((ch, x) => {
      const posS = posToString({ x, y });
      if (ch === "S") {
        start = posS;
        heights[y][x] = 0;
        as.push(posS);
      } else if (ch === "E") {
        target = posS;
        heights[y][x] = "z".charCodeAt(0) - "a".charCodeAt(0);
      } else {
        heights[y][x] = ch.charCodeAt(0) - "a".charCodeAt(0);
        if (ch === "a") as.push(posS);
      }
    })
  );
  const first = solve(heights, [start], target);
  const second = solve(heights, as, target);
  console.log(first, second);
}

function solve(heights: number[][], starts: string[], target: string) {
  const unresolved = [...starts];
  const paths = new Map<string, string[]>(starts.map((s) => [s, []]));
  while (true) {
    const cS = unresolved.shift();
    if (cS === undefined) break;
    const c = posFromString(cS);
    const cHeight = valueInMap(heights)(c)!;
    const cPath = paths.get(cS)!;
    neighbors4(posFromString(cS)).forEach((p) => {
      const pS = posToString(p);
      if (paths.has(pS)) return;
      const height = valueInMap(heights)(p);
      if (height === undefined || height - cHeight > 1) return;
      paths.set(pS, [...cPath, pS]);
      unresolved.push(pS);
    });
    if (paths.has(target)) break;
  }
  return paths.get(target)?.length;
}
