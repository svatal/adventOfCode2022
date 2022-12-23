// import { testInput as input } from "./23-input";
import { input } from "./23-input";
import {
  IPosition,
  neighbors8,
  posFromString,
  posToString,
} from "./utils/position2D";

export function doIt(progress: (...params: any[]) => void) {
  let actual: string[] = [];
  input.split(`\n`).forEach((line, y) =>
    line.split("").forEach((tile, x) => {
      if (tile === "#") actual.push(posToString({ x, y }));
    })
  );
  for (let turn = 0; turn < 10; turn++) {
    ({ actual } = doTurn(actual));
  }

  console.log(actual);
  const elves = actual.map(posFromString);
  const minX = Math.min(...elves.map(({ x, y }) => x));
  const maxX = Math.max(...elves.map(({ x, y }) => x));
  const minY = Math.min(...elves.map(({ x, y }) => y));
  const maxY = Math.max(...elves.map(({ x, y }) => y));
  const first = (maxX - minX + 1) * (maxY - minY + 1) - elves.length;

  let turn = 10;
  let changed = true;
  while (changed) {
    ({ actual, changed } = doTurn(actual));
    turn++;
  }

  const second = turn;
  console.log(first, second);
}

const possibleMoves: ((i: number) => IPosition)[] = [
  (i) => ({ x: i, y: -1 }),
  (i) => ({ x: i, y: +1 }),
  (i) => ({ x: -1, y: i }),
  (i) => ({ x: +1, y: i }),
];

function doTurn(actual: string[]) {
  const actualPositions = new Set(actual);
  const next: string[] = [...actual];
  const moves = new Set<string>();
  actual.forEach((e, i) => {
    const { x, y } = posFromString(e);
    const wantToMove = neighbors8({ x, y })
      .map(posToString)
      .some((p) => actualPositions.has(p));
    if (!wantToMove) return;
    const n3 = [-1, 0, +1];

    let move: string | undefined = undefined;
    for (let i = 0; i < possibleMoves.length; i++) {
      const possibleMove = possibleMoves[i];
      const consider = n3
        .map(possibleMove)
        .map((p) => posToString({ x: x + p.x, y: y + p.y }));
      if (consider.every((p) => !actualPositions.has(p))) {
        move = consider[1];
        break;
      }
    }
    if (move === undefined) return;
    if (moves.has(move)) {
      next.forEach((n, i) => {
        if (n === move) next[i] = actual[i];
      });
      return;
    }
    moves.add(move);
    next[i] = move;
  });
  actual = next;
  const f = possibleMoves.shift()!;
  possibleMoves.push(f);
  return { actual, changed: moves.size > 0 };
}
