// import { testInput as input } from "./01-input";
import { input } from "./01-input";

export function doIt() {
  const parsed = input
    .split(`\n\n`)
    .map((elf) => elf.split("\n").reduce((a, b) => a + +b, 0));
  const first = Math.max(...parsed);
  const i = parsed.sort((a, b) => b - a);
  const second = i[0] + i[1] + i[2];
  console.log(first, second);
}
