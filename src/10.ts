// import { testInput as input } from "./10-input";
import { input } from "./10-input";
import { splitToGroupsOf } from "./utils/util";

export function doIt() {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split(" "))
    .map(([op, x]) => ({ op, x }));
  let reg = 1;
  let cycle = 0;
  let first = 0;
  let pixels: string[] = [];
  function tick() {
    cycle++;
    if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
      first += cycle * reg;
    }
    pixels.push(Math.abs(((cycle - 1) % 40) - reg) < 2 ? "#" : ".");
  }
  parsed.forEach(({ op, x }) => {
    if (op === "noop") {
      tick();
    } else {
      tick();
      tick();
      reg += +x;
    }
  });
  const screen = splitToGroupsOf(pixels, 40).map((l) => l.join(""));
  console.log(first);
  console.log(screen);
}
