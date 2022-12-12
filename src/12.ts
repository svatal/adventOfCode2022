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
  let heights: number[][] = prefillArray(parsed.length, () => []);
  parsed.forEach((l, y) =>
    l.forEach((ch, x) => {
      const posS = posToString({ x, y });
      if (ch === "S") {
        start = posS;
        heights[y][x] = 0;
      } else if (ch === "E") {
        target = posS;
        heights[y][x] = "z".charCodeAt(0) - "a".charCodeAt(0);
      } else {
        heights[y][x] = ch.charCodeAt(0) - "a".charCodeAt(0);
      }
    })
  );
  //   console.log(heights);
  const paths = new Map<string, string[]>([[start, []]]);
  const unresolved = [start];
  heights.forEach((l, y) =>
    l.forEach((h, x) => {
      if (h === 0) {
        const pS = posToString({ x, y });
        unresolved.push(pS);
        paths.set(pS, []);
      }
    })
  );
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
  const first = paths.get(target)?.length;
  const second = parsed.length;
  console.log(first, second);
}
