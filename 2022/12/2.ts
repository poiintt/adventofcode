import { readFile } from "fs/promises";

function getResult(input: string) {
  let grid = input.split("\n").map((line) => line.split(""));

  type Cords = { x: number; y: number };

  let endingPos: Cords = { x: 0, y: 0 };
  const possibleStarts: Cords[] = [];

  // const mov: Cords[][] = grid.map(() => []);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const elevation = grid[i][j];
      if (elevation === "E") {
        endingPos = { x: j, y: i };
      }
      if (elevation === "a" && j < 3) {
        possibleStarts.push({ x: j, y: i });
      }
    }
  }

  function print(currPath: Cords[]) {
    for (let i = 0; i < grid.length; i++) {
      const line: string[] = [];
      for (let j = 0; j < grid[i].length; j++) {
        if (currPath.some((cord) => cord.x === j && cord.y === i)) {
          line.push("#");
        } else {
          line.push(".");
        }
      }
      console.log(line.join(""));
    }
  }

  const isValidNeighbor = (currPosI: Cords, nextPosDiff: Cords) => {
    const currElevation = grid[currPosI.y][currPosI.x];
    const nextElevation =
      grid[currPosI.y + nextPosDiff.y]?.[currPosI.x + nextPosDiff.x];

    if (
      currElevation === "." ||
      nextElevation == null ||
      nextElevation === "." ||
      nextElevation === "S"
    ) {
      return null;
    }

    if (currElevation !== "z" && nextElevation === "E") return null;
    if (currElevation === "z" && nextElevation === "E") {
      // console.log(currElevation, nextElevation);
      return 1;
    }
    if (currElevation === "S") return 1;
    const diff = nextElevation.charCodeAt(0) - currElevation.charCodeAt(0);
    if (diff > 1) return null;
    // console.log(currElevation, nextElevation, diff);
    return diff;
  };

  let count = 0;
  let minSteps = Infinity;
  for (const possibleStart of possibleStarts) {
    const queue: Cords[] = [];
    queue.push({ ...possibleStart });
    // console.log(queue[0]);
    const grid = input.split("\n").map((line) => line.split(""));
    const mov: Cords[][] = grid.map(() => []);

    while (queue.length) {
      const currentPosition = queue.shift()!;

      const elev = grid[currentPosition.y][currentPosition.x];

      if (elev === "E") {
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
        if (grid[neighbor.y][neighbor.x] !== "." && elev !== ".") {
          queue.push(neighbor);
          mov[neighbor.y][neighbor.x] = { ...currentPosition };
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
    const l = path.length - 1;
    // console.log({ l });
    if (l < minSteps) {
      minSteps = l;
    }
    // print(path);

    // const minSteps = path.length - 1;
  }
  return minSteps;
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
// { exampleResult: 29, puzzleResult: 446 }
