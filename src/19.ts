// import { testInput as input } from "./19-input";
import { input } from "./19-input";

export function doIt(progress: (...params: any[]) => void) {
  const blueprints = input
    .split(`\n`)
    .map((line) => line.split(":"))
    .map(([ls, le]) => ({
      id: +ls.split(" ")[1],
      types: le
        .split(".")
        .slice(0, -1)
        .map((r) => r.split(" robot costs "))
        .map(([type, ingredients]) => ({
          type: type.split(" ")[2],
          ingredients: ingredients
            .split(" and ")
            .map((i) => i.split(" "))
            .map(([count, ingredient]) => ({ ingredient, count: +count })),
        }))
        .reverse(),
    }));
  let first = 0;
  for (let bi = 0; bi < blueprints.length; bi++) {
    const b = blueprints[bi];
    const geodes = pickRobot(b, { ore: 1 }, {}, getMax(b), 24);
    first += b.id * geodes;
  }
  let second = 1;
  for (let bi = 0; bi < Math.min(3, blueprints.length); bi++) {
    const b = blueprints[bi];
    const geodes = pickRobot(b, { ore: 1 }, {}, getMax(b), 32);
    second *= geodes;
  }
  console.log(first, second);

  function getMax(b: typeof blueprints[number]) {
    return ["ore", "clay", "obsidian"]
      .map((i) => ({
        ingredient: i,
        maxCount: Math.max(
          ...b.types.map(
            (t) => t.ingredients.find((ti) => ti.ingredient === i)?.count ?? 0
          )
        ),
      }))
      .reduce((c, i) => {
        c[i.ingredient] = i.maxCount;
        return c;
      }, {} as Record<string, number>);
  }

  function pickRobot(
    b: typeof blueprints[number],
    initRobots: Record<string, number>,
    initInventory: Record<string, number>,
    max: Record<string, number>,
    initMinutesLeft: number
  ): number {
    const rs = b.types.map((r) => {
      if (r.ingredients.some((i) => !initRobots[i.ingredient])) return 0; // unable to create, pick another robot
      if (initRobots[r.type] >= max[r.type]) return 0; // we dont need another one
      if (initInventory[r.type] >= 2 * max[r.type]) return 0; // enough suplies
      const inventory = { ...initInventory };
      const robots = { ...initRobots };
      let minutesLeft = initMinutesLeft;
      while (minutesLeft-- > 0) {
        const can = r.ingredients.every(
          (i) => inventory[i.ingredient] >= i.count
        );
        Object.keys(robots).forEach(
          (type) => (inventory[type] = (inventory[type] || 0) + robots[type])
        );
        if (can) {
          robots[r.type] = (robots[r.type] || 0) + 1;
          r.ingredients.forEach((i) => (inventory[i.ingredient] -= i.count));
          return pickRobot(b, robots, inventory, max, minutesLeft);
        }
      }
      progress(b.id, robots, inventory["geode"] ?? 0);
      return inventory["geode"] ?? 0;
    });
    return Math.max(...rs);
  }
}
