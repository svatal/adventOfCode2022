// import { testInput as input } from "./04-input";
import { input } from "./04-input";

export function doIt() {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split(",").map((x) => x.split("-").map((x) => +x)));
  const first = parsed.filter(
    ([[s1, e1], [s2, e2]]) => (s1 <= s2 && e1 >= e2) || (s1 >= s2 && e1 <= e2)
  ).length;
  const second = parsed.filter(
    ([[s1, e1], [s2, e2]]) => (s1 <= s2 && s2 <= e1) || (s2 <= s1 && s1 <= e2)
  ).length;
  console.log(first, second);
}
