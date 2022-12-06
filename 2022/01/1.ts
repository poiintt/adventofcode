import { readFile } from "fs/promises";

function getResult(input: string) {
  const sums = input.split("\n\n").map((inventories) =>
    inventories
      .split("\n")
      .map((calories) => parseInt(calories))
      .reduce((total, calories) => total + calories, 0)
  );

  const max = Math.max(...sums);
  return max;
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
// { exampleResult: 24000, puzzleResult: 68923 }
