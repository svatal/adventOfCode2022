// import { testInput as input } from "./05-input";
import { input } from "./05-input";
import { splitToGroupsOf } from "./utils/util";

export function doIt() {
  const [planS, opsS] = input.split(`\n\n`);
  const plan: string[][] = [];
  planS
    .split("\n")
    .reverse()
    .slice(1)
    .forEach((line) => {
      splitToGroupsOf(line.split(""), 4).forEach((chs, i) => {
        if (chs[1] !== " ") {
          (plan[i] = plan[i] ?? []).push(chs[1]);
        }
      });
    });
  const ops = opsS
    .split("\n")
    .map((o) => o.split(" "))
    .map((l) => ({ count: +l[1], from: +l[3] - 1, to: +l[5] - 1 }));
  const plan1 = deepCopy(plan);
  ops.forEach((o) => {
    for (let i = 0; i < o.count; i++) {
      const x = plan1[o.from].pop()!;
      plan1[o.to].push(x);
    }
  });
  const first = plan1.map((s) => s[s.length - 1]).join("");
  //   console.log(plan);
  const plan2 = deepCopy(plan);
  ops.forEach((o) => {
    const y: string[] = [];
    for (let i = 0; i < o.count; i++) {
      const x = plan2[o.from].pop()!;
      y.unshift(x);
    }
    plan2[o.to].push(...y);
  });

  const second = plan2.map((s) => s[s.length - 1]).join("");
  console.log(first, second);
}

function deepCopy<T>(plan: T[][]) {
  return [...plan.map((s) => [...s])];
}
