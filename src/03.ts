// import { testInput as input } from "./03-input";
import { input } from "./03-input";

export function doIt() {
  const parsed = input.split(`\n`);
  const a = parsed
    .map((line) => [
      line.substring(0, line.length / 2),
      line.substring(line.length / 2),
    ])
    .map(([a, b]) => a.split("").find((x) => b.indexOf(x) >= 0)!);
  const first = getCodes(a).reduce((a, b) => a + b, 0);
  const groups: string[][] = [];
  let c: string[] = [];
  parsed.forEach((x, i) => {
    c.push(x);
    if (i % 3 === 2) {
      groups.push(c);
      c = [];
    }
  });
  const b = groups.map(
    ([l1, l2, l3]) =>
      l1.split("").find((x) => l2.indexOf(x) >= 0 && l3.indexOf(x) >= 0)!
  );
  console.log(b);
  const second = getCodes(b).reduce((a, b) => a + b, 0);
  console.log(first, second);
}

function getCodes(a: string[]): number[] {
  return a
    .map((x) => x!.charCodeAt(0) - "a".charCodeAt(0) + 1)
    .map((x) => (x > 0 ? x : x + 58));
}
