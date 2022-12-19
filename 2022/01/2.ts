import { file } from "bun";

function getResult(input: string) {
  return input
    .split("\n\n")
    .map((inventories) =>
      inventories
        .split("\n")
        .map((calories) => parseInt(calories))
        .reduce((total, calories) => total + calories, 0)
    )
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((total, calories) => total + calories, 0);
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
// { exampleResult: 45000, puzzleResult: 200044 }
