// import { testInput as input } from "./21-input";
import { input } from "./21-input";

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
    }))
    .reduce((c, i) => {
      c[i.name] = i.op;
      return c;
    }, {} as Record<string, INumber | IExpression | IHuman>);
  const keys = Object.keys(parsed);
  parsed["humn"] = { type: "human" };
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
  const root = parsed["root"] as IExpression;
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
  const first = parsed["root"];
  const second = n;
  console.log(first, second);
}
