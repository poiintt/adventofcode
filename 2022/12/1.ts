import { readFile } from "fs/promises";

function getResult(input: string) {
  const grid = input.split("\n").map((line) => line.split(""));

  type Cords = { x: number; y: number };

  const mov: (Cords | null)[][] = [];
  let startingPos: Cords = { x: 0, y: 0 };
  let endingPos: Cords = { x: 0, y: 0 };
  for (let i = 0; i < grid.length; i++) {
    mov[i] = [];
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "S") {
        startingPos = { x: j, y: i };
      } else if (grid[i][j] === "E") {
        endingPos = { x: j, y: i };
      }
      mov[i][j] = null;
    }
  }

  // let currentPos = startingPos;

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

  // let minSteps = Infinity;
  let calls = 0;
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
    console.log(`${currElevation}->${nextElevation}`);
    return diff;
  };

  // let currentPos = { ...startingPos };
  while (queue.length) {
    const currentPosition = queue.shift()!;
    // console.log(currentPosition);
    // console.log(calls);

    if (
      currentPosition.x === endingPos.x &&
      currentPosition.y === endingPos.y
    ) {
      console.log("end");
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
    // console.log(neighbors);

    for (const neig of neighbors) {
      if (grid[neig.y][neig.x] !== ".") {
        queue.push(neig);
        mov[neig.y][neig.x] = currentPosition;
      }
    }
    grid[currentPosition.y][currentPosition.x] = ".";

    // if (diffs.includes(100)) {
    // if (currPath.length < minSteps) {
    //   minSteps = currPath.length;
    // }
    // console.log();
    // console.log(minSteps);
    // print(currPath);
    // return minSteps;
    // }
    // const [leftDiff, rightDiff, topDiff, bottomDiff] = diffs;

    // if (diffs.every((d) => d == null)) {
    // console.log("no end");
    // print(currPath);
    // blockedCords.push(currentPos);
    // return;
    // }

    // type Direction = -1 | 0 | 1;

    // const recurseArgs: {
    //   diff: number;
    //   direction: { x: Direction; y: Direction };
    // }[] = [];

    // if (rightDiff != null) {
    //   recurseArgs.push({
    //     diff: rightDiff,
    //     direction: { x: 1, y: 0 },
    //   });
    // }
    // if (bottomDiff != null) {
    //   recurseArgs.push({
    //     diff: bottomDiff,
    //     direction: { x: 0, y: 1 },
    //   });
    // }
    // if (leftDiff != null) {
    //   recurseArgs.push({
    //     diff: leftDiff,
    //     direction: { x: -1, y: 0 },
    //   });
    // }
    // if (topDiff != null) {
    //   recurseArgs.push({
    //     diff: topDiff,
    //     direction: { x: 0, y: -1 },
    //   });
    // }

    // return diffs;

    // rescurse([startingPos]);
    // function rescurse(currPath: Cords[]) {
    // if (
    //   currPath.length > minSteps ||
    //   // currPath.length < 300 ||
    //   currPath.length > 500
    // ) {
    //   return;
    // }

    // if (isFinite(minSteps)) {
    //   console.log({ minSteps });
    // }
    calls++;
    // console.log(calls, minSteps, currPath.length);

    // const currentElevation = grid[currentPos.y][currentPos.x];

    // const blocked = blockedCords.some(
    //   (c) => c.x === currentPos.x && c.y === currentPos.y
    // );
    // if (blocked) {
    //   return;
    // }

    // for (const args of recurseArgs) {
    // const path = [
    //   ...currPath,
    //   {
    //     x: currentPos.x + args.direction.x,
    //     y: currentPos.y + args.direction.y,
    //   },
    // ];
    // rescurse(path);
    // }
  }

  const printPath = () => {
    let paths = [endingPos];

    let path = paths[0];
    while (true) {
      let parent = mov[path.y][path.x];
      if (parent == null) break;
      paths.push(parent);
      path = parent;
    }
    // console.log(paths);
    return paths.length;
  };
  const minSteps = printPath();

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
// { exampleResult: 31, puzzleResult:  }
