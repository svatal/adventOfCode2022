// import { testInput as input } from "./24-input";
import { input } from "./24-input";
import {
  IPosition,
  neighbors4,
  posFromString,
  posToString,
} from "./utils/position2D";

export function doIt(progress: (...params: any[]) => void) {
  let nBlizzards: string[] = [];
  let sBlizzards: string[] = [];
  let wBlizzards: string[] = [];
  let eBlizzards: string[] = [];
  let start!: string;
  let target!: string;
  let xMax!: number;
  let yMax!: number;
  input.split(`\n`).forEach((line, y, lines) =>
    line.split("").forEach((tile, x) => {
      const pos = { x: x - 1, y: y - 1 };
      switch (tile) {
        case "^":
          nBlizzards.push(posToString(pos));
          break;
        case "v":
          sBlizzards.push(posToString(pos));
          break;
        case ">":
          eBlizzards.push(posToString(pos));
          break;
        case "<":
          wBlizzards.push(posToString(pos));
          break;
        case ".":
          if (y === 0) {
            start = posToString(pos);
          } else if (y === lines.length - 1) {
            target = posToString(pos);
            xMax = line.length - 2;
            yMax = lines.length - 2;
          }
      }
    })
  );
  console.log(xMax, yMax);
  console.log(start, target);
  // console.log(nBlizzards);
  console.log("---");

  let turn = 0;
  for (let path = 0; path < 3; path++) {
    let targetReached = false;
    let currentQ = path % 2 === 0 ? [start] : [target];
    let currentTarget = path % 2 === 0 ? target : start;
    let skipBlizzard = path > 0;
    while (!targetReached) {
      // console.log(currentQ);
      let nextQ = new Set<string>();
      if (skipBlizzard) {
        skipBlizzard = false;
      } else {
        moveAllBlizzards();
      }
      let nextBlizzards = new Set([
        ...nBlizzards,
        ...sBlizzards,
        ...eBlizzards,
        ...wBlizzards,
      ]);
      // console.log(nextBlizzards);
      while (currentQ.length > 0) {
        const posS = currentQ.pop()!;
        const pos = posFromString(posS);
        if (posS == currentTarget) {
          targetReached = true;
          break;
        }
        if (!nextBlizzards.has(posS)) nextQ.add(posS);
        neighbors4(pos).forEach(addIfPossible);

        function addIfPossible(p: IPosition) {
          const ps = posToString(p);
          if (ps === currentTarget || (!nextBlizzards.has(ps) && isInside(p)))
            nextQ.add(ps);
        }
      }
      if (!targetReached) {
        turn++;
        console.log(turn, nextQ.size);
        // console.log(nextQ);
        currentQ = [...nextQ];
      }
    }
    console.log(turn);
  }
  const first = turn;
  const second = 0;
  console.log(first, second);

  function isInside({ x, y }: IPosition) {
    return x >= 0 && y >= 0 && x < xMax && y < yMax;
  }

  function moveAllBlizzards() {
    nBlizzards = moveBlizzards(nBlizzards, "^");
    sBlizzards = moveBlizzards(sBlizzards, "v");
    wBlizzards = moveBlizzards(wBlizzards, "<");
    eBlizzards = moveBlizzards(eBlizzards, ">");
  }

  function moveBlizzards(blizzards: string[], direction: string) {
    const xDiff = direction === ">" ? 1 : direction === "<" ? -1 : 0;
    const yDiff = direction === "v" ? 1 : direction === "^" ? -1 : 0;
    return blizzards
      .map(posFromString)
      .map(({ x, y }) => ({
        x: (x + xDiff + xMax) % xMax,
        y: (y + yDiff + yMax) % yMax,
      }))
      .map(posToString);
  }
}
