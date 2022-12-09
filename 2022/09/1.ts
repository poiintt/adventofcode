import { readFile } from "fs/promises";

function getResult(input: string) {
  const series = input.split("\n").map((row) => {
    const parts = row.split(" ");
    return [parts[0], parseInt(parts[1])] as const;
  });

  type Cord = { x: number; y: number };

  let headPos: Cord = { x: 0, y: 0 };
  let tailPos: Cord = { x: 0, y: 0 };
  const tailPositions: string[] = [];

  const isTwoStepsAway = () =>
    (tailPos.x + 2 === headPos.x && tailPos.y === headPos.y) ||
    (tailPos.x - 2 === headPos.x && tailPos.y === headPos.y) ||
    (tailPos.x === headPos.x && tailPos.y + 2 === headPos.y) ||
    (tailPos.x === headPos.x && tailPos.y - 2 === headPos.y);

  const notTouchingAndNotInSameRowOrColumn = () => {
    const topLeft = tailPos.x - 1 !== headPos.x || tailPos.y + 1 !== headPos.y;
    const topRight = tailPos.x + 1 !== headPos.x || tailPos.y + 1 !== headPos.y;
    const bottomLeft =
      tailPos.x - 1 !== headPos.x || tailPos.y - 1 !== headPos.y;
    const bottomRight =
      tailPos.x + 1 !== headPos.x || tailPos.y - 1 !== headPos.y;

    const left = tailPos.x - 1 !== headPos.x || tailPos.y !== headPos.y;
    const right = tailPos.x + 1 !== headPos.x || tailPos.y !== headPos.y;
    const top = tailPos.x !== headPos.x || tailPos.y + 1 !== headPos.y;
    const bottom = tailPos.x !== headPos.x || tailPos.y - 1 !== headPos.y;

    const touchingDiagonally = topLeft && topRight && bottomLeft && bottomRight;
    const touchingStraight = right && left && top && bottom;

    const differentRowAndColumn =
      tailPos.x !== headPos.x && tailPos.y !== headPos.y;

    return touchingDiagonally && touchingStraight && differentRowAndColumn;
  };

  const setPosition = (axis: keyof Cord, num: number) => {
    headPos[axis] += num;
    if (isTwoStepsAway()) {
      tailPos[axis] += num;
    } else if (notTouchingAndNotInSameRowOrColumn()) {
      const otherAxis = axis === "x" ? "y" : "x";
      tailPos[otherAxis] = headPos[otherAxis];
      tailPos[axis] += num;
    }
  };

  tailPositions.push(`${tailPos.x}|${tailPos.y}`);
  for (const [direction, distance] of series) {
    for (let i = 0; i < distance; i++) {
      if (direction === "L") {
        setPosition("x", -1);
      } else if (direction === "R") {
        setPosition("x", +1);
      } else if (direction === "D") {
        setPosition("y", -1);
      } else if (direction === "U") {
        setPosition("y", +1);
      }
      tailPositions.push(`${tailPos.x}|${tailPos.y}`);
    }
  }
  const set = [...new Set(tailPositions)];
  const count = set.length;
  return count;
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
// { exampleResult: 13, puzzleResult: 6269 }
