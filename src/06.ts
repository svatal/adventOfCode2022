// import { testInput as input } from "./06-input";
import { input } from "./06-input";

export function doIt() {
  const first = findUniques(input, 4);
  const second = findUniques(input, 14);
  console.log(first, second);
}

function findUniques(input: string, count: number) {
  for (let i = count; i < input.length; i++) {
    const x = new Set(input.substring(i - count, i));
    if (x.size == count) {
      return i;
    }
  }
  throw "not found";
}
