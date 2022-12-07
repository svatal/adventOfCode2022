// import { testInput as input } from "./07-input";
import { input } from "./07-input";
import { sum } from "./utils/util";

interface IDir {
  dirs: Record<string, IDir>;
  files: Record<string, number>;
  size?: number;
}

export function doIt() {
  const parsed = input.split(`\n`).map((l) => l.split(" "));
  const root: IDir = { dirs: {}, files: {} };
  let current = root;
  const dirs = [root];
  parsed.forEach((line) => {
    if (line[0] === "$") {
      if (line[1] === "cd") {
        if (line[2] == "/") {
          current = root;
        } else {
          current = current.dirs[line[2]];
        }
      }
    } else {
      // list
      if (line[0] === "dir") {
        current.dirs[line[1]] = { dirs: { "..": current }, files: {} };
        dirs.push(current.dirs[line[1]]);
      } else {
        const [size, name] = line;
        current.files[name] = +size;
      }
    }
  });
  for (let i = dirs.length - 1; i >= 0; i--) {
    const dir = dirs[i];
    dir.size =
      Object.values(dir.files).reduce(sum, 0) +
      Object.keys(dir.dirs)
        .filter((k) => k !== "..")
        .map((k) => dir.dirs[k].size!)
        .reduce(sum, 0);
  }
  const first = dirs
    .filter((d) => d.size! < 100000)
    .map((d) => d.size!)
    .reduce(sum, 0);
  const totalSize = root.size!;
  const freeSpace = 70000000 - totalSize;
  const spaceNeeded = 30000000 - freeSpace;
  const second = Math.min(
    ...dirs.map((d) => d.size!).filter((s) => s > spaceNeeded)
  );
  console.log(first, second);
}
