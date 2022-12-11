// import { testInput as input } from "./11-input";
import { input } from "./11-input";
import { prefillArray } from "./utils/util";

export function doIt() {
  const monkeys = input
    .split(`\n\n`)
    .map((monkey) => monkey.split("\n"))
    .map((m) => ({
      items: m[1]
        .split(":")[1]
        .split(",")
        .map((n) => +n),
      opText: m[2].split("= ")[1],
      test: +m[3].split("divisible by")[1],
      true: +m[4].split("throw to monkey")[1],
      false: +m[5].split("throw to monkey")[1],
    }));
  const mod = monkeys.map((m) => m.test).reduce((a, b) => a * b);
  console.log(monkeys);
  const inspections = prefillArray(monkeys.length, () => 0);
  for (let round = 0; round < 10000; round++) {
    monkeys.forEach((m, mi) => {
      let i = undefined;
      while (true) {
        i = m.items.shift();
        if (i === undefined) break;
        // const newVal = Math.floor(eval(`var old = ${i}; ${m.opText}`) / 3);
        const newVal = eval(`var old = ${i}; (${m.opText}) % ${mod}`);
        monkeys[newVal % m.test === 0 ? m.true : m.false].items.push(newVal);
        // console.log(`monkey ${mi}`, i, m.opText, newVal, newVal % m.test === 0);
        inspections[mi]++;
      }
    });
  }
  console.log(inspections);
  inspections.sort((a, b) => b - a);
  const first = inspections[0] * inspections[1];
  const second = monkeys.length;
  console.log(first, second);
}
