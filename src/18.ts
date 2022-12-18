// import { testInput as input } from "./18-input";
import { input } from "./18-input";
import { neighbours6, valueInMap } from "./utils/positions3D";
import { prefillArray, sum } from "./utils/util";

enum Tile {
  Air,
  Lava,
  Steam,
}

export function doIt() {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split(",").map((x) => +x))
    .map(([x, y, z]) => ({ x, y, z }));
  const maxZ = Math.max(...parsed.map(({ z }) => z));
  const maxY = Math.max(...parsed.map(({ y }) => y));
  const maxX = Math.max(...parsed.map(({ x }) => x));

  const map: Tile[][][] = prefillArray(maxZ + 1, () =>
    prefillArray(maxY + 1, () => prefillArray(maxX + 1, () => Tile.Air))
  );
  parsed.forEach(({ x, y, z }) => {
    map[z][y][x] = Tile.Lava;
  });
  const first = parsed
    .map(
      (p) =>
        neighbours6(p)
          .map(valueInMap(map))
          .filter((t) => t === Tile.Air || t === undefined).length
    )
    .reduce(sum);

  let steamExpanded = false;
  do {
    steamExpanded = false;
    for (let z = 0; z < map.length; z++) {
      for (let y = 0; y < map[z].length; y++) {
        for (let x = 0; x < map[z][y].length; x++) {
          if (map[z][y][x] !== Tile.Air) continue;
          if (
            [0, maxX].includes(x) ||
            [0, maxY].includes(y) ||
            [0, maxZ].includes(z) ||
            neighbours6({ x, y, z })
              .map(valueInMap(map))
              .some((t) => t === Tile.Steam || t === undefined)
          ) {
            map[z][y][x] = Tile.Steam;
            steamExpanded = true;
          }
        }
      }
    }
  } while (steamExpanded);
  const second = parsed
    .map(
      (p) =>
        neighbours6(p)
          .map(valueInMap(map))
          .filter((t) => t === Tile.Steam || t === undefined).length
    )
    .reduce(sum);
  console.log(first, second);
}
