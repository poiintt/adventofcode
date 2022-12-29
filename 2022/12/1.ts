import { file } from "bun";

function getResult(input: string) {
  const grid = input.split("\n").map((line) => line.split(""));

  type Cords = { x: number; y: number };

  const mov: (Cords | null)[][] = [];
  let startingPos: Cords = { x: 0, y: 0 };
  let endingPos: Cords = { x: 0, y: 0 };
  for (let y = 0; y < grid.length; y++) {
    mov[y] = [];
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "S") {
        startingPos = { x, y };
      } else if (grid[y][x] === "E") {
        endingPos = { x, y };
      }
      mov[y][x] = null;
    }
  }

  const queue: Cords[] = [];
  queue.push({ ...startingPos });

  const isValidNeighbor = (currPosI: Cords, nextPosDiff: Cords) => {
    const currElevation = grid[currPosI.y][currPosI.x];
    const nextElevation =
      grid[currPosI.y + nextPosDiff.y]?.[currPosI.x + nextPosDiff.x];

    if (nextElevation == null || nextElevation === "S") {
      return null;
    }
    if (currElevation !== "z" && nextElevation === "E") return null;
    if (currElevation === "z" && nextElevation === "E") {
      return 1;
    }
    if (currElevation === "S") return 1;
    const diff = nextElevation.charCodeAt(0) - currElevation.charCodeAt(0);
    if (diff > 1) return null;
    if (nextElevation === ".") return null;
    return diff;
  };

  while (queue.length) {
    const currentPosition = queue.shift()!;
    if (
      currentPosition.x === endingPos.x &&
      currentPosition.y === endingPos.y
    ) {
      break;
    }

    const neighbors = [
      { x: -1, y: 0 },
      { x: +1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: +1 },
    ]
      .filter((cord) => isValidNeighbor(currentPosition, cord) != null)
      .map((c) => ({
        x: currentPosition.x + c.x,
        y: currentPosition.y + c.y,
      }));

    for (const neighbor of neighbors) {
      if (grid[neighbor.y][neighbor.x] !== ".") {
        queue.push(neighbor);
        mov[neighbor.y][neighbor.x] = currentPosition;
      }
    }
    grid[currentPosition.y][currentPosition.x] = ".";
  }

  const getPath = () => {
    let paths = [endingPos];

    let path = paths[0];
    while (true) {
      let parent = mov[path.y][path.x];
      if (parent == null) break;
      paths.push(parent);
      path = parent;
    }
    return paths;
  };
  const path = getPath();

  const minSteps = path.length - 1;
  return minSteps;
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
// { exampleResult: 31, puzzleResult: 447 }
