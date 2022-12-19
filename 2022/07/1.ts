import { file } from "bun";

function getResult(input: string) {
  let directoryMap: Record<string, number> = {};
  const currentPath: string[] = [];

  const lines = input.split("\n");
  for (const line of lines) {
    if (line.startsWith("$ cd")) {
      const directoryName = line.slice(5);

      if (directoryName === "..") {
        currentPath.pop();
      } else {
        currentPath.push(directoryName);
      }
    } else if (!line.startsWith("dir ") && !line.startsWith("$ ls")) {
      const [sizeString] = line.split(" ");
      const size = parseInt(sizeString);

      const pathPartsList = currentPath.map((_, i, arr) =>
        arr.slice(0, i + 1).join("->")
      );

      for (const path of pathPartsList) {
        directoryMap[path] ??= 0;
        directoryMap[path] += size;
      }
    }
  }

  const sum = Object.entries(directoryMap)
    .filter(([_, size]) => size <= 100_000)
    .reduce((total, [_, size]) => total + size, 0);

  return sum;
}

const example = await file("./example.txt").text();
const puzzle = await file("./puzzle.txt").text();

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
// { exampleResult: 95437, puzzleResult: 1391690 }
