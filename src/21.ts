// import { testInput as input } from "./21-input";
import { input } from "./21-input";
import { toDictionary } from "./utils/util";

interface IExpression {
  type: "expression";
  args: string[];
}

interface INumber {
  type: "number";
  num: number;
}

interface IHuman {
  type: "human";
}

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split(": "))
    .map(([name, op]) => ({
      name,
      op: isNaN(+op)
        ? ({ type: "expression", args: op.split(" ") } as const)
        : ({ type: "number", num: +op } as const),
    }));
  const first = solve(parsed);
  const second = solve(parsed, "humn");
  console.log(first, second);
}

function solve(
  parsedArray: { name: string; op: IExpression | INumber }[],
  keyToOverrideWithHuman?: string
) {
  const parsed = toDictionary(
    parsedArray,
    (i) => i.name,
    (i) =>
      i.name === keyToOverrideWithHuman ? ({ type: "human" } as const) : i.op
  );
  const keys = Object.keys(parsed);
  let changed = false;
  do {
    changed = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const x = parsed[key];
      if (x.type !== "expression") continue;
      const a = parsed[x.args[0]];
      const op = x.args[1];
      const b = parsed[x.args[2]];
      if (a.type === "number" && b.type === "number") {
        switch (op) {
          case "+":
            parsed[key] = { type: "number", num: a.num + b.num };
            break;
          case "-":
            parsed[key] = { type: "number", num: a.num - b.num };
            break;
          case "*":
            parsed[key] = { type: "number", num: a.num * b.num };
            break;
          case "/":
            parsed[key] = { type: "number", num: a.num / b.num };
            break;
          default:
            throw "unknown op" + op;
        }
        changed = true;
      }
    }
  } while (changed);
  const root = parsed["root"];
  if (root.type === "number") return root.num;
  if (root.type === "human") throw "unexpected";
  const a = parsed[root.args[0]];
  const b = parsed[root.args[2]];
  let n = a.type === "number" ? a.num : (b as INumber).num;
  let eq = (a.type === "number" ? b : a) as IExpression | IHuman;
  while (eq.type === "expression") {
    const a = parsed[eq.args[0]];
    const b = parsed[eq.args[2]];
    const n1 = a.type === "number" ? a : b;
    const eq2 = a.type === "number" ? b : a;
    if (n1.type !== "number" || eq2.type === "number") {
      console.log(eq, a, b);
      throw "damn";
    }
    switch (eq.args[1]) {
      case "+":
        n -= n1.num;
        break;
      case "-":
        if (n1 === a) n = n1.num - n;
        else n += n1.num;
        break;
      case "*":
        n /= n1.num;
        break;
      case "/":
        if (n1 === a) n = n1.num / n;
        else n *= n1.num;
        break;
    }
    eq = eq2;
  }
  return n;
}
