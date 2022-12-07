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

      const pathPartsList = currentPath.map((_, i, arr) =>
        arr.slice(0, i + 1).join("->")
      );

      for (const pathPart of pathPartsList) {
        result[pathPart] += size;
      }
    }
  }

  const under10k = Object.entries(result).filter(
    ([_, size]) => size <= 100_000
  );

  const sum = under10k.reduce((total, [_, size]) => total + size, 0);

  return sum;
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
// { exampleResult: 95437, puzzleResult: 1391690 }
