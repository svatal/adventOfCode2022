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
    const toMove = plan1[o.from].splice(plan1[o.from].length - o.count);
    plan1[o.to].push(...toMove.reverse());
  });

  const plan2 = deepCopy(plan);
  ops.forEach((o) => {
    const toMove = plan2[o.from].splice(plan2[o.from].length - o.count);
    plan2[o.to].push(...toMove);
  });

  console.log(getTop(plan1), getTop(plan2));
}

function deepCopy<T>(plan: T[][]) {
  return [...plan.map((s) => [...s])];
}

function getTop(plan: string[][]) {
  return plan.map((s) => s[s.length - 1]).join("");
}
