// import { testInput as input } from "./02-input";
import { input } from "./02-input";

const results = {
  "A X": 4,
  "B Y": 5,
  "C Z": 6,
  "A Y": 8,
  "B Z": 9,
  "C X": 7,
  "A Z": 3,
  "B X": 1,
  "C Y": 2,
};

const results2 = {
  "A X": 3,
  "B X": 1,
  "C X": 2,
  "A Y": 4,
  "B Y": 5,
  "C Y": 6,
  "A Z": 8,
  "B Z": 9,
  "C Z": 7,
};

export function doIt() {
  const parsed = input.split(`\n`).map((line) => line as keyof typeof results);
  const first = parsed.map((l) => results[l]).reduce((a, b) => a + b);
  const second = parsed.map((l) => results2[l]).reduce((a, b) => a + b);
  console.log(first, second);
}
