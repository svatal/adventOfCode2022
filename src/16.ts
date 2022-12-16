// import { testInput as input } from "./16-input";
import { input } from "./16-input";

interface Tile {
  name: string;
  rate: number;
  paths: { to: string; price: number }[];
}
export function doIt() {
  let parsed = input.split(`\n`).map((line) => ({
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

  while (true) {
    const cut = Object.keys(maze)
      .map((k) => maze[k])
      .find((p) => p.rate === 0 && p.name !== "AA" && p.paths.length == 2);
    if (cut === undefined) break;
    const p1 = cut.paths[0];
    const p2 = cut.paths[1];
    const dist = p1.price + p2.price;
    // console.log(p1, p2, Object.keys(maze));
    maze[p1.to].paths = maze[p1.to].paths.map((p) =>
      p.to === cut.name ? { to: p2.to, price: dist } : p
    );
    maze[p2.to].paths = maze[p2.to].paths.map((p) =>
      p.to === cut.name ? { to: p1.to, price: dist } : p
    );
    delete maze[cut.name];
  }
  const mazeKeys = Object.keys(maze);
  //   const targets = mazeKeys
  //     .map((key) => maze[key])
  //     .filter((tile) => tile.rate > 0);
  const distances: Map<string, Map<string, number>> = new Map(
    mazeKeys.map((key) => [
      key,
      new Map(maze[key].paths.map((p) => [p.to, p.price])),
    ])
  );
  for (let tries = 0; tries < mazeKeys.length; tries++) {
    for (let i = 0; i < mazeKeys.length; i++) {
      const key = mazeKeys[i];
      const tileDists = distances.get(key)!;
      tileDists.forEach((d1, key1) => {
        distances.get(key1)!.forEach((d2, key2) => {
          if (key == key2) return;
          const currentDist = tileDists.get(key2);
          const newDist = d1 + d2;
          if (currentDist === undefined || newDist < currentDist)
            tileDists.set(key2, newDist);
        });
      });
    }
  }
  console.log(distances);
  //   console.log(maze);
  //   Object.keys(maze)
  //     .map((key) => maze[key])
  //     .forEach((t) => console.log(t));
  const first = getFlow(maze, distances, 27, new Set(["AA"]), 0, 0, [
    { to: "AA", time: 0 },
    { to: "AA", time: 0 },
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
  pos: ITravel[],
  open: Set<string>
  //   time: number
): string {
  return `${pos.map((p) => `${p.time} ${p.to}`)};${[...open.values()]}`;
}

interface ITravel {
  to: string;
  time: number;
}

let log = true;

function getFlow(
  maze: Record<string, Tile>,
  distances: Map<string, Map<string, number>>,
  time: number,
  open: Set<string>,
  currentFlow: number,
  flown: number,
  [p1, p2]: ITravel[]
): number {
  if (log) console.log(time, open, currentFlow, flown, p1, p2);
  if (time === 1) log = false;
  if (time === 1) return flown + currentFlow;
  if (p1.time > 1 && p2.time > 1) {
    return getFlow(
      maze,
      distances,
      time - 1,
      open,
      currentFlow,
      flown + currentFlow,
      [p1, p2].map((p) => ({ ...p, time: p.time - 1 }))
    );
  }

  const currentName1 = p1.to;
  const currentName2 = p2.to;
  //   const state = serialize([p1, p2], open);
  //   const cached = db.get(state);
  //   if (cached !== undefined) {
  //     const val = cached[time];
  //     if (val !== undefined) return flown + val;
  //     if (cached.some((v, t) => t > time)) return 0; // we can get there sooner, ignore it
  //   }
  const tile1 = maze[currentName1];
  const tile2 = maze[currentName2];
  //   console.log(current, tile);
  const next1: {
    open: string[];
    flowGain: number;
    goTo: string;
    price: number;
  }[] = [];
  const next2: {
    open: string[];
    flowGain: number;
    goTo: string;
    price: number;
  }[] = [];
  if (p1.time > 1) {
    next1.push({
      open: [],
      flowGain: 0,
      goTo: p1.to,
      price: p1.time - 1,
    });
  } else {
    next1.push(
      ...[...distances.get(currentName1)!.entries()]
        .filter(([name]) => !open.has(name))
        .map(([name, dist]) => ({
          open: [name],
          flowGain: tile1.rate,
          goTo: name,
          price: dist + 1,
        }))
    );
    if (next1.length === 0)
      next1.push({
        open: [],
        flowGain: tile1.rate,
        goTo: "1-finished",
        price: 50,
      });
  }
  if (p2.time > 1) {
    next2.push({
      open: [],
      flowGain: 0,
      goTo: p2.to,
      price: p2.time - 1,
    });
  } else {
    next2.push(
      ...[...distances.get(currentName2)!.entries()]
        .filter(([name]) => !open.has(name))
        .map(([name, dist]) => ({
          open: [name],
          flowGain: tile2.rate,
          goTo: name,
          price: dist + 1,
        }))
    );
    if (next2.length === 0)
      next2.push({
        open: [],
        flowGain: tile2.rate,
        goTo: "2-finished",
        price: 50,
      });
  }
  const next: number[] = [];
  for (let i1 = 0; i1 < next1.length; i1++) {
    for (let i2 = 0; i2 < next2.length; i2++) {
      const a = next1[i1];
      const b = next2[i2];
      if (a.goTo === b.goTo) continue;
      next.push(
        getFlow(
          maze,
          distances,
          time - 1,
          new Set([...open, ...a.open, ...b.open].sort()),
          currentFlow + a.flowGain + b.flowGain,
          flown + currentFlow,
          [
            { to: a.goTo, time: a.price },
            { to: b.goTo, time: b.price },
          ].sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0))
        )
      );
      if (time === 27)
        console.log(
          Math.max(...next),
          next.length,
          i1,
          next1.length,
          i2,
          next2.length
        );
    }
  }
  if (next.length === 0) {
    const a = next1[0];
    const b = next2[0];
    next.push(
      getFlow(
        maze,
        distances,
        time - 1,
        new Set([...open, ...a.open, ...b.open].sort()),
        currentFlow + a.flowGain + b.flowGain,
        flown + currentFlow,
        [
          { to: a.goTo, time: Math.min(a.price, b.price) },
          { to: "finished", time: 50 },
        ]
      )
    );
  }
  //   console.log(next1, next2, next);
  const best = Math.max(...next);
  if (time > bestTimeSolved) {
    bestTimeSolved = time;
    // console.log(next1, next2, next);
    console.log(best, time);
  }
  //   const newCached = cached !== undefined ? cached : [];
  //   newCached[time] = best - flown;
  //   if (cached === undefined) db.set(state, newCached);
  return best;
}
