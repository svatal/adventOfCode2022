// import { testInput as input } from "./13-input";
import { input } from "./13-input";

type X = number | X[];

export function doIt() {
  const parsed = input
    .split(`\n\n`)
    .map((pair) => pair.split("\n").map((l) => JSON.parse(l)));
  const first = parsed.reduce(
    (prev, p, i) => prev + (compare(p[0], p[1]) ? i + 1 : 0),
    0
  );
  const all = parsed.flat(1);
  const p1 = all.filter((l) => compare(l, [[2]])).length + 1;
  const p2 = all.filter((l) => compare(l, [[6]])).length + 2;
  const second = p1 * p2;
  console.log(first, second);
}

function compare(left: X[], right: X[]): boolean | undefined {
  left = [...left];
  right = [...right];
  while (true) {
    const l1 = left.shift();
    const r1 = right.shift();
    if (l1 === undefined && r1 === undefined) return undefined;
    if (r1 === undefined) return false;
    if (l1 === undefined) return true;
    const lType = typeof l1;
    const rType = typeof r1;
    if (lType === "object" && rType === "object") {
      const x = compare(l1 as X[], r1 as X[]);
      if (x !== undefined) return x;
    }
    if (lType === "object" && rType === "number") {
      const x = compare(l1 as X[], [r1]);
      if (x !== undefined) return x;
    }
    if (lType === "number" && rType === "object") {
      const x = compare([l1], r1 as X[]);
      if (x !== undefined) return x;
    }
    if (l1 < r1) return true;
    if (l1 > r1) return false;
  }
}
