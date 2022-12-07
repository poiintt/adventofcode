import { readFile } from "fs/promises";

function getResult(input: string) {
  let result: Record<string, number> = {};
  const currentPath: string[] = [];

  const initJoinedPath = (dir: string) => {
    const joinedPath = [...currentPath, dir].join("->");
    if (result[joinedPath] == null) {
      result[joinedPath] = 0;
    }
  };

  const lines = input.split("\n");
  for (const line of lines) {
    if (line.startsWith("$ cd")) {
      const path = line.slice(5);

      if (path === "..") {
        currentPath.pop();
      } else {
        initJoinedPath(path);
        currentPath.push(path);
      }
    } else if (line.startsWith("dir ")) {
      const [_, dirName] = line.split(" ");
      initJoinedPath(dirName);
    } else if (!line.startsWith("$ ls")) {
      const [sizeString] = line.split(" ");
      const size = parseInt(sizeString);

      const pathPartsList = [...currentPath].map((_, i, arr) =>
        arr.slice(0, i + 1).join("->")
      );

      for (const pathPart of pathPartsList) {
        result[pathPart] += size;
      }
    }
  }

  const unusedSpace = 70_000_000 - result["/"];
  const toDelete = 30_000_000 - unusedSpace;

  const o = Object.entries(result)
    .sort(([_, a], [__, b]) => a - b)
    .find(([_, size]) => size >= toDelete);

  return o?.[1];
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
