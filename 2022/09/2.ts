import { readFile } from "fs/promises";

function getResult(input: string) {
  const series = input.split("\n").map((row) => {
    const parts = row.split(" ");
    return [parts[0], parseInt(parts[1])] as const;
  });

  type Cord = { x: number; y: number };

  const knotCount = 10;
  const knotPos: Cord[] = [];

  for (let i = 0; i < knotCount; i++) {
    knotPos.push({ x: 0, y: 0 });
  }

  const tailPositions: string[] = [];
  tailPositions.push(`${knotPos.at(-1)!.x}|${knotPos.at(-1)!.y}`);

  const print = () => {
    console.log();
    for (let row = 20; row >= -5; row--) {
      let line = "";
      for (let column = -11; column < 14; column++) {
        let x: Cord | null = null;
        let x2: number | null = null;
        for (let knotIndex = 0; knotIndex < knotPos.length; knotIndex++) {
          const knot = knotPos[knotIndex];
          if (row === knot.y && column === knot.x) {
            // console.log("xxxx");
            x = knot;
            x2 = knotIndex;
            break;
          }
        }
        if (row === 0 && column === 0) {
          line += "X";
        } else if (x2 != null) {
          // console.log("dhdfhfddshdgl");
          line += x2;
        } else {
          line += ".";
        }
      }
      console.log(line);
    }
    console.log({ 5: knotPos[5], 6: knotPos[6] });
    console.log();
    // console.log(knotPos.slice(0, 5));
  };
  const printTail = () => {
    for (let row = 20; row >= -5; row--) {
      let line = "";
      for (let column = -11; column < 14; column++) {
        let x: Cord | null = null;
        for (let knotIndex = 0; knotIndex < tailPositions.length; knotIndex++) {
          const knot = {
            x: parseInt(tailPositions[knotIndex].split("|")[0]),
            y: parseInt(tailPositions[knotIndex].split("|")[1]),
          };
          if (row === knot.y && column === knot.x) {
            x = knot;
          }
        }
        if (row === 0 && column === 0) {
          line += "X";
        } else if (x != null) {
          // console.log("dhdfhfddshdgl");
          line += "#";
        } else {
          line += ".";
        }
      }
      console.log(line);
    }
    console.log();
    // console.log(knotPos.slice(0, 5));
  };

  const isTwoStepsAway = (headPos: Cord, tailPos: Cord) =>
    (tailPos.x + 2 === headPos.x && tailPos.y === headPos.y) ||
    (tailPos.x - 2 === headPos.x && tailPos.y === headPos.y) ||
    (tailPos.x === headPos.x && tailPos.y + 2 === headPos.y) ||
    (tailPos.x === headPos.x && tailPos.y - 2 === headPos.y);

  const notTouchingAndNotInSameRowOrColumn = (headPos: Cord, tailPos: Cord) => {
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
    // "x", -1

    knotPos[0][axis] += num;
    // console.log(knotPos[0]);
    for (let i = 1; i < knotCount; i++) {
      const knotBefore = knotPos[i - 1];
      const currentKnot = knotPos[i];
      if (isTwoStepsAway(knotBefore, currentKnot)) {
        // if (
        //   currentKnot.x + 2 === knotBefore.x &&
        //   currentKnot.y === knotBefore.y
        // ) {
        //   knotPos[i].x++;
        // } else if (
        //   currentKnot.x - 2 === knotBefore.x &&
        //   currentKnot.y === knotBefore.y
        // ) {
        //   knotPos[i].x--;
        // } else if (
        //   currentKnot.x === knotBefore.x &&
        //   currentKnot.y + 2 === knotBefore.y
        // ) {
        //   knotPos[i].y++;
        // } else if (
        //   currentKnot.x === knotBefore.x &&
        //   currentKnot.y - 2 === knotBefore.y
        // ) {
        //   knotPos[i].y--;
        // }

        // if (i === 5 || i === 6)
        //   console.log({
        //     isTwoStepsAway: true,
        //   });
        // axis is wrong
        // dont use num

        // if (i === 6)
        //   console.log(
        //     `i 6 ${knotBefore}, ${currentKnot} ${
        //       knotBefore.x === currentKnot.x
        //     } ${knotBefore.y === currentKnot.y}`
        //   );
        if (knotBefore.x === currentKnot.x) {
          if (i === 6) {
            // console.log(axis, num, knotBefore);
            // console.log(currentKnot);
          }
          // knotPos[i].y += num;
          if (knotBefore.y > currentKnot.y) {
            knotPos[i].y++;
          } else {
            knotPos[i].y--;
          }
        } else if (knotBefore.y === currentKnot.y) {
          // knotPos[i].x += num;
          if (knotBefore.x > currentKnot.x) {
            knotPos[i].x++;
          } else {
            knotPos[i].x--;
          }
        }
      } else if (notTouchingAndNotInSameRowOrColumn(knotBefore, currentKnot)) {
        const otherAxis = axis === "x" ? "y" : "x";
        // wrong
        // knotPos[i][otherAxis] += num;

        if (knotBefore.x > currentKnot.x) {
          knotPos[i].x += 1;
        } else if (knotBefore.x < currentKnot.x) {
          knotPos[i].x -= 1;
        }

        if (knotBefore.y > currentKnot.y) {
          knotPos[i].y += 1;
        } else if (knotBefore.y < currentKnot.y) {
          knotPos[i].y -= 1;
        }

        // if (knotBefore[otherAxis] > currentKnot[otherAxis]) {
        //   knotPos[i][otherAxis] += 1;
        // } else {
        //   knotPos[i][otherAxis] -= 1;
        // }
        // knotPos[i][axis] += num;
      }
    }
  };

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
      tailPositions.push(`${knotPos.at(-1)!.x}|${knotPos.at(-1)!.y}`);
      if (direction === "L" && distance === 8) {
        // console.log("distance", i);
        if (i === 2 || i === 3) print();
      }
    }
    // console.log(i);
    // console.log({ direction, distance });
    // print();
  }

  printTail();
  const set = [...new Set(tailPositions)];
  // console.log(tailPositions.length);
  // console.log(set);
  const count = set.length;
  return count;
}

const example = await readFile("./example.txt", { encoding: "utf8" });
// const puzzle = await readFile("./largerExample.txt", { encoding: "utf8" });
const puzzle = await readFile("./puzzle.txt", { encoding: "utf8" });

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
// { exampleResult: 1, puzzleResult: 2557 }
