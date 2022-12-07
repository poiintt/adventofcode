import { readFile } from "fs/promises";

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

  const sizeToDelete = 30_000_000 - (70_000_000 - directoryMap["/"]);

  const firstDirOverSizeToDelete = Object.entries(directoryMap)
    .sort(([_, a], [__, b]) => a - b)
    .find(([_, size]) => size >= sizeToDelete);

  return firstDirOverSizeToDelete?.[1];
}

const example = await readFile("./example.txt", { encoding: "utf8" });
const puzzle = await readFile("./puzzle.txt", { encoding: "utf8" });

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
// { exampleResult: 24933642, puzzleResult: 5469168 }
