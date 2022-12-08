import { readFile } from "fs/promises";

function getResult(input: string) {
  const trees = input
    .split("\n")
    .map((row) => row.split("").map((height) => parseInt(height)));

  let scenicScore = 0;

  for (let rowIndex = 1; rowIndex < trees.length - 1; rowIndex++) {
    const row = trees[rowIndex];
    for (let columnIndex = 1; columnIndex < row.length - 1; columnIndex++) {
      const column = trees.map((row) => row[columnIndex]);

      const treesLeft = row.slice(0, columnIndex).reverse();
      const treesRight = row.slice(columnIndex + 1);
      const treesTop = column.slice(0, rowIndex).reverse();
      const treesBottom = column.slice(rowIndex + 1);

      const currentScenicScore = [treesLeft, treesRight, treesTop, treesBottom]
        .map((trees) => {
          const index = trees.findIndex((height) => height >= row[columnIndex]);
          if (index !== -1) return index + 1;
          return trees.length;
        })
        .reduce(
          (scenicScore, viewingDistance) => scenicScore * viewingDistance,
          1
        );

      if (currentScenicScore > scenicScore) {
        scenicScore = currentScenicScore;
      }
    }
  }

  return scenicScore;
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
// { exampleResult: 8, puzzleResult: 180000 }
