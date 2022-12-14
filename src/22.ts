// import { testInput as input } from "./22-input";
import { input } from "./22-input";

enum Tile {
  Empty,
  Rock,
}

type Map = (Tile | undefined)[][];

export function doIt(progress: (...params: any[]) => void) {
  const [mapS, path] = input.split(`\n\n`).map(
    (line) => line //
  );
  const map: Map = [];
  mapS.split("\n").map((l, y) =>
    l.split("").forEach((tile, x) => {
      if (x === 0) map[y] = [];
      if (tile === " ") return;
      map[y][x] = tile === "#" ? Tile.Rock : Tile.Empty;
    })
  );
  const first = doAWalk(map, path, getNextPositionOnAPlane);
  const second = doAWalk(map, path, getNextPositionOnACube);
  console.log(first, second);
}

interface INextPosition {
  xNext: number;
  yNext: number;
  facingNext: number;
}

function doAWalk(
  map: Map,
  fullPath: string,
  getNextPosition: (bad: INextPosition, map: Map) => INextPosition
) {
  let pathRest = fullPath;
  let facing = 0;
  let y = 0;
  let x = findFirst(map[0]);
  while (pathRest.length > 0) {
    // console.log("pos", x, y);
    const dist = parseInt(pathRest);
    pathRest = pathRest.slice(("" + dist).length);
    // move
    for (let i = 0; i < dist; i++) {
      const xGain = facing % 2 === 0 ? (facing === 0 ? 1 : -1) : 0;
      const yGain = facing % 2 === 0 ? 0 : facing === 1 ? 1 : -1;
      let xNext = x + xGain;
      let yNext = y + yGain;
      let facingNext = facing;
      let nextTile = map[yNext]?.[xNext];
      if (nextTile === undefined) {
        ({ xNext, yNext, facingNext } = getNextPosition(
          {
            xNext,
            yNext,
            facingNext,
          },
          map
        ));
      }
      nextTile = map[yNext]?.[xNext];
      if (nextTile === undefined) {
        console.log("unexpected", x, y, facing, xNext, yNext);
        throw "unexpected";
      }
      if (nextTile === Tile.Rock) break;
      else {
        x = xNext;
        y = yNext;
        facing = facingNext;
      }
    }
    if (pathRest.length === 0) break;
    const turn = pathRest[0];
    pathRest = pathRest.slice(1);
    facing = (facing + (turn === "R" ? 1 : 3)) % 4;
  }
  console.log(x + 1, y + 1);
  return 1000 * (y + 1) + 4 * (x + 1) + facing;
}

function getNextPositionOnACube(bad: INextPosition) {
  let { xNext, yNext, facingNext } = bad;
  switch (facingNext) {
    case 0:
      if (xNext === 50) {
        xNext = yNext - 100;
        yNext = 149;
        facingNext = 3;
      } else if (xNext === 100) {
        if (yNext < 100) {
          xNext = yNext + 50;
          yNext = 49;
          facingNext = 3;
        } else {
          yNext = 149 - yNext;
          xNext = 149;
          facingNext = 2;
        }
      } else if (xNext === 150) {
        yNext = 149 - yNext;
        xNext = 99;
        facingNext = 2;
      } else throw "unexpected";
      break;
    case 1:
      if (yNext === 50) {
        yNext = xNext - 50;
        xNext = 99;
        facingNext = 2;
      } else if (yNext === 150) {
        yNext = xNext + 100;
        xNext = 49;
        facingNext = 2;
      } else if (yNext == 200) {
        yNext = 0;
        xNext += 100;
      } else throw "unexpected";
      break;
    case 2:
      if (xNext === -1) {
        if (yNext < 150) {
          xNext = 50;
          yNext = 149 - yNext;
          facingNext = 0;
        } else {
          xNext = yNext - 100;
          yNext = 0;
          facingNext = 1;
        }
      } else if (xNext === 49) {
        if (yNext < 50) {
          xNext = 0;
          yNext = 149 - yNext;
          facingNext = 0;
        } else {
          xNext = yNext - 50;
          yNext = 100;
          facingNext = 1;
        }
      } else throw "unexpected";
      break;
    case 3:
      if (yNext === -1) {
        if (xNext < 100) {
          yNext = 100 + xNext;
          xNext = 0;
          facingNext = 0;
        } else {
          xNext -= 100;
          yNext = 199;
        }
      } else if (yNext === 99) {
        yNext = xNext + 50;
        xNext = 50;
        facingNext = 0;
      } else throw "unexpected";
      break;
  }
  return { xNext, yNext, facingNext };
}

function getNextPositionOnAPlane(bad: INextPosition, map: Map) {
  const { xNext, yNext, facingNext } = bad;
  switch (facingNext) {
    case 0:
    case 2:
      return {
        xNext: findFirst(map[bad.yNext], facingNext === 2),
        yNext,
        facingNext,
      };
    case 1:
    case 3:
      return {
        xNext,
        yNext: findFirst(
          map.map((line) => line[bad.xNext]),
          bad.facingNext === 3
        ),
        facingNext,
      };
    default:
      throw "unexpected";
  }
}

function findFirst<T>(line: T[], reverse: boolean = false) {
  const l = line.map((tile, x) => ({ tile, x }));
  if (reverse) l.reverse();
  return l.find((item) => item !== undefined && item.tile !== undefined)!.x;
}
