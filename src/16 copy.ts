import { testInput as input } from "./16-input";
// import { input } from "./16-input";

interface Tile {
  name: string;
  rate: number;
  paths: { to: string; price: number }[];
}
export function doIt() {
  const parsed = input.split(`\n`).map((line) => ({
    name: line.split(" ")[1],
    rate: parseInt(line.split("=")[1]),
    paths: takeS(line.split("valve")[1])
      .split(", ")
      .map((to) => ({ to, price: 1 })),
  }));
  //   console.log(parsed);
  const maze = parsed.reduce((prev, current) => {
    prev[current.name] = current;
    return prev;
  }, {} as Record<string, Tile>);
  const first = getFlow(maze, 26, new Set<string>(), 0, 0, 0, [
    { pos: "AA", from: undefined },
    { pos: "AA", from: undefined },
  ]);
  const second = parsed.length;
  console.log(first, second);
}

function takeS(s: string) {
  if (s.startsWith("s")) return s.substring(2);
  return s.substring(1);
}

// let bestTimeSolved = 0;
// const db = new Map<string, number>();
// function serialize(
//   currentName: string,
//   open: Set<string>,
//   time: number
// ): string {
//   return `${time};${currentName};${[...open.values()]}`;
// }

// function getFlow(
//   maze: Record<string, Tile>,
//   time: number,
//   open: Set<string>,
//   currentFlow: number,
//   flown: number,
//   currentName: string
// ): number {
//   if (time === 1) return flown + currentFlow;
//   const state = serialize(currentName, open, time);
//   const cached = db.get(state);
//   if (cached !== undefined) return flown + cached;
//   const tile = maze[currentName];
//   //   console.log(current, tile);
//   const next: number[] = [];
//   if (!open.has(currentName) && tile.rate > 0) {
//     next.push(
//       getFlow(
//         maze,
//         time - 1,
//         new Set([...open.values(), currentName]),
//         currentFlow + tile.rate,
//         flown + currentFlow,
//         currentName
//       )
//     );
//   }
//   next.push(
//     ...tile.paths.map((neighbourName) =>
//       getFlow(
//         maze,
//         time - 1,
//         open,
//         currentFlow,
//         flown + currentFlow,
//         neighbourName
//       )
//     )
//   );
//   const best = Math.max(...next);
//   if (time > bestTimeSolved) {
//     bestTimeSolved = time;
//     console.log(best, time, state);
//   }
//   db.set(state, best - flown);
//   return best;
// }

class SuperMap<TKey, TValue> {
  maps: Array<Map<TKey, TValue>>;

  constructor() {
    this.maps = [new Map()];
  }

  set(key: TKey, value: TValue) {
    if (this.maps[this.maps.length - 1].size === 16777000)
      this.maps.push(new Map());
    return this.maps[this.maps.length - 1].set(key, value);
  }

  get(key: TKey) {
    for (const map of this.maps) {
      const value = map.get(key);
      if (value !== undefined) return value;
    }
    return undefined;
  }
}

let bestTimeSolved = 0;
const db = new SuperMap<string, number[]>();

function serialize(
  currentName1: string,
  currentName2: string,
  open: Set<string>
  //   time: number
): string {
  const names = [currentName1, currentName2];
  return `${names};${[...open.values()]}`;
}

function getFlow(
  maze: Record<string, Tile>,
  time: number,
  open: Set<string>,
  openedBefore: number,
  currentFlow: number,
  flown: number,
  [p1, p2]: { pos: string; from: string | undefined }[]
): number {
  //   console.log(time, currentName1, currentName2);
  if (time === 1) return flown + currentFlow;
  if (openedBefore > 4) return 0; //shortcut
  const currentName1 = p1.pos;
  const currentName2 = p2.pos;

  const state = serialize(currentName1, currentName2, open);
  const cached = db.get(state);
  if (cached !== undefined) {
    const val = cached[time];
    if (val !== undefined) return flown + val;
    if (cached.some((v, t) => t > time)) return 0; // we can get there sooner, ignore it
  }
  const tile1 = maze[currentName1];
  const tile2 = maze[currentName2];
  //   console.log(current, tile);
  const next1: {
    open: string[];
    flowGain: number;
    standingOn: string;
    price: number;
  }[] = [];
  const next2: {
    open: string[];
    flowGain: number;
    standingOn: string;
    price: number;
  }[] = [];
  if (!open.has(currentName1) && tile1.rate > 0) {
    next1.push({
      open: [currentName1],
      flowGain: tile1.rate,
      standingOn: currentName1,
      price: 1,
    });
  }
  next1.push(
    ...tile1.paths
      .filter((p) => p.to !== p1.from)
      .map((p) => ({
        open: [],
        flowGain: 0,
        standingOn: p.to,
        price: p.price,
      }))
  );
  if (
    !open.has(currentName2) &&
    tile2.rate > 0 &&
    currentName1 !== currentName2
  ) {
    next2.push({
      open: [currentName2],
      flowGain: tile2.rate,
      standingOn: currentName2,
      price: 1,
    });
  }
  next2.push(
    ...tile2.paths
      .filter((p) => p.to !== p2.from)
      .map((p) => ({
        open: [],
        flowGain: 0,
        standingOn: p.to,
        price: p.price,
      }))
  );
  const next: number[] = [];
  for (let i1 = 0; i1 < next1.length; i1++) {
    for (let i2 = 0; i2 < next2.length; i2++) {
      const a = next1[i1];
      const b = next2[i2];
      next.push(
        getFlow(
          maze,
          time - 1,
          a.open.length === 0 && b.open.length === 0
            ? open
            : new Set([...open, ...a.open, ...b.open].sort()),
          a.open.length === 0 && b.open.length === 0 ? openedBefore + 1 : 0,
          currentFlow + a.flowGain + b.flowGain,
          flown + currentFlow,
          [
            {
              pos: a.standingOn,
              from: a.open.length > 0 ? undefined : currentName1,
            },
            {
              pos: b.standingOn,
              from: b.open.length > 0 ? undefined : currentName2,
            },
          ].sort((a, b) => (a.pos < b.pos ? -1 : a.pos > b.pos ? 1 : 0))
        )
      );
    }
  }
  //   console.log(next1, next2, next);
  const best = Math.max(...next);
  if (time > bestTimeSolved) {
    bestTimeSolved = time;
    console.log(best, time, state);
  }
  const newCached = cached !== undefined ? cached : [];
  newCached[time] = best - flown;
  if (cached === undefined) db.set(state, newCached);
  return best;
}
