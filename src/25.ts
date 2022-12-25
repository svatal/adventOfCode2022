// import { testInput as input } from "./25-input";
import { sum } from "./utils/util";
import { input } from "./25-input";

export function doIt(progress: (...params: any[]) => void) {
  const parsed = input.split(`\n`).map(
    (line) => line //
  );
  const first = toSNAFU(parsed.map(fromSNAFU).reduce(sum));
  console.log(first);
}

function toSNAFU(n: number) {
  let s = "";
  while (n > 0) {
    const x = n % 5;
    n = Math.floor(n / 5);

    if (x > 2) n++;
    switch (x) {
      case 0:
      case 1:
      case 2:
        s = `${x}` + s;
        break;
      case 3:
        s = "=" + s;
        break;
      case 4:
        s = "-" + s;
        break;
    }
  }
  return s;
}

function fromSNAFU(s: string) {
  let n = 0;
  const ss = s.split("");
  while (ss.length > 0) {
    const x = ss.shift()!;
    const base = 5 ** ss.length;
    let xn = 0;
    switch (x) {
      case "0":
      case "1":
      case "2":
        xn = +x;
        break;
      case "-":
        xn = -1;
        break;
      case "=":
        xn = -2;
        break;
    }
    n += xn * base;
  }
  return n;
}
