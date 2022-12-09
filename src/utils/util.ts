export function sum(a: number, b: number): number {
  return a + b;
}

export function splitToGroupsOf<T>(a: T[], n: number): T[][] {
  a = [...a];
  const groups: T[][] = [];
  while (a.length) {
    groups.push(a.splice(0, n));
  }
  return groups;
}

export function prefillArray<T>(
  length: number,
  getItem: (idx: number) => T
): T[] {
  return Array.from({ length }, (_, idx) => getItem(idx));
}
