// import { testInput as input } from "./20-input";
import { input } from "./20-input";

interface IContainer {
  n: number;
  idx: number;
  prevIdx: number;
  nextIdx: number;
}

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map((line, i, all) => ({
    n: +line * 811589153,
    idx: i,
    nextIdx: (i + 1) % all.length,
    prevIdx: (i - 1 + all.length) % all.length,
  }));
  for (let turn = 0; turn < 10; turn++) {
    for (let ci = 0; ci < parsed.length; ci++) {
      const c = parsed[ci];
      let move = c.n % (parsed.length - 1);
      while (move < 0) move += parsed.length - 1;
      // console.log(parsed);
      // console.log("move", c, move);
      if (move === 0) continue;
      let target = c;
      for (let i = 0; i < move; i++) target = parsed[target.nextIdx];
      parsed[c.prevIdx].nextIdx = c.nextIdx;
      parsed[c.nextIdx].prevIdx = c.prevIdx;
      c.prevIdx = target.idx;
      c.nextIdx = target.nextIdx;
      parsed[target.nextIdx].prevIdx = c.idx;
      target.nextIdx = c.idx;
    }
  }
  // console.log(parsed);
  const zeroC = parsed.find((c) => c.n === 0)!;
  let first = 0;
  let current = zeroC;
  for (let i = 0; i < 3001; i++) {
    if (i === 1000 || i === 2000 || i === 3000) first += current.n;
    current = parsed[current.nextIdx];
  }
  const second = parsed.length;
  console.log(first, second);
}
