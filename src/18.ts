// import { testInput as input } from "./18-input";
import { input } from "./18-input";
import { prefillArray, sum } from "./utils/util";

export function doIt() {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split(",").map((x) => +x))
    .map(([x, y, z]) => ({ x, y, z }));
  const maxZ = Math.max(...parsed.map(({ z }) => z));
  const maxY = Math.max(...parsed.map(({ y }) => y));
  const maxX = Math.max(...parsed.map(({ x }) => x));

  const map: (boolean | undefined)[][][] = prefillArray(maxZ + 1, () =>
    prefillArray(maxY + 1, () => prefillArray(maxX + 1, () => undefined))
  );
  parsed.forEach(({ x, y, z }) => {
    map[z][y][x] = true;
  });
  const first = parsed
    .map(({ x, y, z }) => {
      let surface = 0;
      surface += map[z][y][x + 1] ? 0 : 1;
      surface += map[z][y][x - 1] ? 0 : 1;
      surface += map[z][y + 1]?.[x] ? 0 : 1;
      surface += map[z][y - 1]?.[x] ? 0 : 1;
      surface += map[z + 1]?.[y]?.[x] ? 0 : 1;
      surface += map[z - 1]?.[y]?.[x] ? 0 : 1;
      // console.log(surface, x, y, z);
      return surface;
    })
    .reduce(sum);

  let airExpanded = false;
  do {
    airExpanded = false;
    for (let z = 0; z < map.length; z++) {
      const slice = map[z];
      for (let y = 0; y < slice.length; y++) {
        const line = slice[y];
        for (let x = 0; x < line.length; x++) {
          const point = line[x];
          if (point !== undefined) continue;
          if (
            z === 0 ||
            z === map.length - 1 ||
            y === 0 ||
            y === slice.length - 1 ||
            x === 0 ||
            x === line.length - 1 ||
            map[z][y][x + 1] === false ||
            map[z][y][x - 1] === false ||
            map[z][y + 1]?.[x] === false ||
            map[z][y - 1]?.[x] === false ||
            map[z + 1]?.[y]?.[x] === false ||
            map[z - 1]?.[y]?.[x] === false
          ) {
            line[x] = false;
            airExpanded = true;
          }
        }
      }
    }
  } while (airExpanded);
  let second = first;
  for (let z = 0; z < map.length; z++) {
    const slice = map[z];
    for (let y = 0; y < slice.length; y++) {
      const line = slice[y];
      for (let x = 0; x < line.length; x++) {
        const point = line[x];
        if (point !== undefined) continue;
        let surface = 0;
        surface += map[z][y][x + 1] === undefined ? 0 : 1;
        surface += map[z][y][x - 1] === undefined ? 0 : 1;
        surface += map[z][y + 1]?.[x] === undefined ? 0 : 1;
        surface += map[z][y - 1]?.[x] === undefined ? 0 : 1;
        surface += map[z + 1]?.[y]?.[x] === undefined ? 0 : 1;
        surface += map[z - 1]?.[y]?.[x] === undefined ? 0 : 1;
        // console.log(surface, z, y, x);
        second -= surface;
      }
    }
  }
  console.log(first, second);
}
