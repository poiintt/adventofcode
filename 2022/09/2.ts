import { file } from "bun";

function getResult(input: string) {
  const series = input.split("\n").map((row) => {
    const parts = row.split(" ");
    return [parts[0], parseInt(parts[1])] as const;
  });

  type Cords = { x: number; y: number };

  const knotCount = 10;
  const knotPos: Cords[] = [];

  for (let i = 0; i < knotCount; i++) {
    knotPos.push({ x: 0, y: 0 });
  }

  const tailPositions: string[] = [];

  const noTouchingKnots = (previousKnot: Cords, currentKnot: Cords) => {
    return [-1, 0, 1]
      .map((x, _, arr) =>
        arr.map(
          (y) =>
            currentKnot.x + x !== previousKnot.x ||
            currentKnot.y + y !== previousKnot.y
        )
      )
      .reduce((acc, curr) => [...acc, ...curr], [])
      .every(Boolean);
  };

  const addTailPosition = () =>
    tailPositions.push(`${knotPos.at(-1)!.x}|${knotPos.at(-1)!.y}`);
  addTailPosition();

  const updatePositions = () => {
    for (let i = 1; i < knotCount; i++) {
      const previousKnot = knotPos[i - 1];
      const currentKnot = knotPos[i];

      const right =
        currentKnot.x + 2 === previousKnot.x &&
        currentKnot.y === previousKnot.y;

      const left =
        currentKnot.x - 2 === previousKnot.x &&
        currentKnot.y === previousKnot.y;

      const top =
        currentKnot.x === previousKnot.x &&
        currentKnot.y + 2 === previousKnot.y;

      const bottom =
        currentKnot.x === previousKnot.x &&
        currentKnot.y - 2 === previousKnot.y;

      const differentRowAndColumn =
        currentKnot.x !== previousKnot.x && currentKnot.y !== previousKnot.y;

      if (right) {
        knotPos[i].x++;
      } else if (left) {
        knotPos[i].x--;
      } else if (top) {
        knotPos[i].y++;
      } else if (bottom) {
        knotPos[i].y--;
      } else if (
        differentRowAndColumn &&
        noTouchingKnots(previousKnot, currentKnot)
      ) {
        if (previousKnot.x > currentKnot.x) {
          knotPos[i].x++;
        } else if (previousKnot.x < currentKnot.x) {
          knotPos[i].x--;
        }

        if (previousKnot.y > currentKnot.y) {
          knotPos[i].y++;
        } else if (previousKnot.y < currentKnot.y) {
          knotPos[i].y--;
        }
      }
    }
    addTailPosition();
  };

  for (const [direction, distance] of series) {
    for (let i = 0; i < distance; i++) {
      if (direction === "L") {
        knotPos[0].x--;
      } else if (direction === "R") {
        knotPos[0].x++;
      } else if (direction === "D") {
        knotPos[0].y--;
      } else if (direction === "U") {
        knotPos[0].y++;
      }
      updatePositions();
    }
  }

  const set = [...new Set(tailPositions)];
  const count = set.length;
  return count;
}

const example = await file("./example.txt").text();
const largerExample = await file("./largerExample.txt").text();
const puzzle = await file("./puzzle.txt").text();

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");

console.time("largerExample");
const largerExampleResult = getResult(largerExample);
console.timeEnd("largerExample");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ exampleResult, largerExampleResult, puzzleResult });
// { exampleResult: 1, largerExampleResult: 36, puzzleResult: 2557 }
