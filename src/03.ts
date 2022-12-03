// import { testInput as input } from "./03-input";
import { input } from "./03-input";
import { splitToGroupsOf, sum } from "./utils/util";

export function doIt() {
  const parsed = input.split(`\n`);
  const first = parsed
    .map((line) => [
      line.substring(0, line.length / 2),
      line.substring(line.length / 2),
    ])
    .map(([a, b]) => a.split("").find((x) => b.indexOf(x) >= 0)!)
    .map(getCode)
    .reduce(sum);
  const second = splitToGroupsOf(parsed, 3)
    .map(
      ([l1, l2, l3]) =>
        l1.split("").find((x) => l2.indexOf(x) >= 0 && l3.indexOf(x) >= 0)!
    )
    .map(getCode)
    .reduce(sum);
  console.log(first, second);
}

function getCode(x: string): number {
  const n = x.charCodeAt(0) - "a".charCodeAt(0) + 1;
  return n > 0 ? n : n + 58;
}
