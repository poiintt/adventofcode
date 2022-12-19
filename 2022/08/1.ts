import { file } from "bun";

function getResult(input: string) {
  const treeGrid = input
    .split("\n")
    .map((row) => row.split("").map((height) => parseInt(height)));

  let interiorCount = 0;

  for (let rowIndex = 1; rowIndex < treeGrid.length - 1; rowIndex++) {
    const row = treeGrid[rowIndex];
    for (let columnIndex = 1; columnIndex < row.length - 1; columnIndex++) {
      const column = treeGrid.map((row) => row[columnIndex]);

      const treesLeft = row.slice(0, columnIndex);
      const treesRight = row.slice(columnIndex + 1);
      const treesTop = column.slice(0, rowIndex);
      const treesBottom = column.slice(rowIndex + 1);

      const treeIsVisible = [treesLeft, treesRight, treesTop, treesBottom]
        .map((trees) => trees.every((height) => height < row[columnIndex]))
        .includes(true);

      if (treeIsVisible) {
        interiorCount++;
      }
    }
  }

  const columnCount = treeGrid.length;
  const rowCount = treeGrid[0].length;
  const edgeCount = (columnCount + rowCount - 2) * 2;

  return edgeCount + interiorCount;
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
// { exampleResult: 21, puzzleResult: 1843 }
