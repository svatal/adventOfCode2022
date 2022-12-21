// import { testInput as input } from "./21-input";
import { input } from "./21-input";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input
    .split(`\n`)
    .map((line) => line.split(": "))
    .map(([name, op]) => ({
      name,
      op: isNaN(+op) ? op.split(" ") : +op,
    }))
    .reduce((c, i) => {
      c[i.name] = i.op;
      return c;
    }, {} as Record<string, number | string[]>);
  const keys = Object.keys(parsed);
  parsed["humn"] = ["?"];
  let changed = false;
  do {
    changed = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const x = parsed[key];
      if (typeof x === "number") continue;
      if (x[0] === "?") continue;
      const a = parsed[x[0]];
      const op = x[1];
      const b = parsed[x[2]];
      if (typeof a === "number" && typeof b === "number") {
        switch (op) {
          case "+":
            parsed[key] = a + b;
            break;
          case "-":
            parsed[key] = a - b;
            break;
          case "*":
            parsed[key] = a * b;
            break;
          case "/":
            parsed[key] = a / b;
            break;
          default:
            throw "unknown op" + op;
        }
        changed = true;
      }
    }
  } while (changed);
  keys.forEach((k) => {
    if (typeof parsed[k] !== "number")
      console.log(k, "=", (parsed[k] as string[]).join(" "));
  });
  const root = parsed["root"] as string[];
  const a = parsed[root[0]];
  const b = parsed[root[2]];
  let n = (typeof a === "number" ? a : b) as number;
  let eq = (typeof a === "number" ? b : a) as string[];
  while (eq[0] !== "?") {
    const a = parsed[eq[0]];
    const b = parsed[eq[2]];
    const n1 = typeof a === "number" ? a : b;
    const eq2 = typeof a === "number" ? b : a;
    if (typeof n1 !== "number" || !Array.isArray(eq2)) {
      console.log(eq, a, b);
      throw "damn";
    }
    switch (eq[1]) {
      case "+":
        n -= n1;
        break;
      case "-":
        if (n1 === a) n = n1 - n;
        else n += n1;
        break;
      case "*":
        n /= n1;
        break;
      case "/":
        if (n1 === a) n = n1 / n;
        else n *= n1;
        break;
    }
    eq = eq2;
  }
  // while (Array.isArray(parsed["humn"])) {
  //   for (let i = 0; i < keys.length; i++) {
  //     const key = keys[i];
  //     const x = parsed[key];
  //     if (typeof x === "number") continue;
  //     if (key === "root") {
  //       const a = parsed[x[0]];
  //       const b = parsed[x[2]];
  //       const n = typeof a === "number" ? a : b;
  //       const eq = typeof a === "number" ? b : a;
  //     }
  //   }
  // }
  const first = parsed["root"];
  const second = n;
  console.log(first, second);
}
