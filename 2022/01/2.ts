import { readFile } from "fs/promises";

function getResult(input: string) {
  const inventories = input.split("\n\n");

  const x = inventories.map((inventory) =>
    inventory.split("\n").map((item) => parseInt(item))
  );

  const sums = x.map((inv) => inv.reduce((acc, curr) => acc + curr, 0));

  const sorted = sums.sort((a, b) => b - a);
  const topThree = sorted.slice(0, 3);
  return topThree.reduce((acc, curr) => acc + curr, 0);
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
// { exampleResult: 45000, puzzleResult: 200044 }
