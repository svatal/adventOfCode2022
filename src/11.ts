// import { testInput as input } from "./11-input";
import { input } from "./11-input";
import { prefillArray } from "./utils/util";

interface IMonkey {
  items: number[];
  opText: string;
  test: number;
  true: number;
  false: number;
}

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
  //   console.log(monkeys);
  const first = getMonkeyBusiness(monkeys, 20, (i, m) =>
    Math.floor(eval(`var old = ${i}; ${m.opText}`) / 3)
  );
  const nsd = monkeys.map((m) => m.test).reduce((a, b) => a * b);
  const second = getMonkeyBusiness(monkeys, 10000, (i, m) =>
    eval(`var old = ${i}; (${m.opText}) % ${nsd}`)
  );
  console.log(first, second);
}

function getMonkeyBusiness(
  monkeys: IMonkey[],
  rounds: number,
  getNewVal: (old: number, monkey: IMonkey) => number
) {
  monkeys = monkeys.map((m) => ({ ...m, items: [...m.items] }));
  const inspections = prefillArray(monkeys.length, () => 0);
  for (let round = 0; round < rounds; round++) {
    monkeys.forEach((monkey, mi) => {
      while (true) {
        const i = monkey.items.shift();
        if (i === undefined) break;
        const newVal = getNewVal(i, monkey);
        monkeys[
          newVal % monkey.test === 0 ? monkey.true : monkey.false
        ].items.push(newVal);
        // console.log(`monkey ${mi}`, i, m.opText, newVal, newVal % m.test === 0);
        inspections[mi]++;
      }
    });
  }
  inspections.sort((a, b) => b - a);
  return inspections[0] * inspections[1];
}
