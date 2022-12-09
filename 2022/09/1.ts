import { readFile } from "fs/promises";

function getResult(input: string) {
  const series = input.split("\n").map((row) => {
    const parts = row.split(" ");
    return [parts[0], parseInt(parts[1])] as const;
  });

  type Cord = [number, number];

  let hPosition: Cord = [0, 0];
  let tPosition: Cord = [0, 0];
  const positionsList: string[] = [];

  const isSamePosition = (h: Cord, t: Cord) => h[0] === t[0] && h[1] === t[1];
  const sameRowOrColumn = (h: Cord, t: Cord) => h[0] === t[0] || h[1] === t[1];

  const isTwoStepsAway = (h: Cord, t: Cord) =>
    (t[0] + 2 === h[0] && t[1] === h[1]) ||
    (t[0] - 2 === h[0] && t[1] === h[1]) ||
    (t[0] === h[0] && t[1] + 2 === h[1]) ||
    (t[0] === h[0] && t[1] - 2 === h[1]);

  const notTouchingAndNotInSameRowOrColumn = (h: Cord, t: Cord) => {
    const topLeft = t[0] - 1 !== h[0] || t[1] + 1 !== h[1];
    const topRight = t[0] + 1 !== h[0] || t[1] + 1 !== h[1];
    const bottomLeft = t[0] - 1 !== h[0] || t[1] - 1 !== h[1];
    const bottomRight = t[0] + 1 !== h[0] || t[1] - 1 !== h[1];
    const left = t[0] - 1 !== h[0] || t[1] !== h[1];
    const right = t[0] + 1 !== h[0] || t[1] !== h[1];
    const top = t[0] !== h[0] || t[1] + 1 !== h[1];
    const bottom = t[0] !== h[0] || t[1] - 1 !== h[1];

    return (
      topLeft &&
      topRight &&
      bottomLeft &&
      bottomRight &&
      right &&
      left &&
      top &&
      bottom &&
      t[0] !== h[0] &&
      t[1] !== h[1]
    );
  };

  const print = (h: Cord, t: Cord) => {
    console.log();
    for (let row = 4; row >= 0; row--) {
      let line = "";
      for (let column = 0; column < 6; column++) {
        if (row === t[1] && column === t[0]) {
          line += "T";
        } else if (row === h[1] && column === h[0]) {
          line += "H";
        } else {
          line += ".";
        }
      }
      console.log(line);
    }
    console.log();
  };

  const shouldAddTail = (h: Cord, t: Cord) => {
    const topLeft = t[0] - 1 === h[0] && t[1] + 1 === h[1];
    const topRight = t[0] + 1 === h[0] && t[1] + 1 === h[1];
    const bottomLeft = t[0] - 1 === h[0] && t[1] - 1 === h[1];
    const bottomRight = t[0] + 1 === h[0] && t[1] - 1 === h[1];

    const isSamePosition = h[0] === t[0] && h[1] === t[1];

    return !(
      topLeft ||
      topRight ||
      bottomLeft ||
      bottomRight ||
      isSamePosition
    );
  };

  positionsList.push(tPosition.join("|"));
  let lastDirection: string | null = null;
  for (const [direction, distance] of series) {
    if (lastDirection == null) {
      lastDirection = direction;
    }
    console.log(`== ${direction} ${distance} ==`);

    for (let i = 0; i < distance; i++) {
      const oldHPosition: Cord = [...hPosition];
      if (direction === "L") {
        hPosition[0]--;
        if (!isSamePosition(hPosition, tPosition)) {
          if (isTwoStepsAway(hPosition, tPosition)) {
            // tPosition = oldHPosition;
            tPosition[0]--;
          } else if (notTouchingAndNotInSameRowOrColumn(hPosition, tPosition)) {
            // console.log("notTouchingAndNotInSameRowOrColumn");
            tPosition[1] = hPosition[1];
            tPosition[0]--;
          } else {
            // console.log("else", { hPosition, tPosition });
          }
        }
        // if (shouldAddTail(hPosition, tPosition)) {
        //   tPosition = oldHPosition;
        // }
      } else if (direction === "R") {
        hPosition[0]++;
        if (!isSamePosition(hPosition, tPosition)) {
          if (isTwoStepsAway(hPosition, tPosition)) {
            tPosition[0]++;
          } else if (notTouchingAndNotInSameRowOrColumn(hPosition, tPosition)) {
            // console.log("notTouchingAndNotInSameRowOrColumn");
            tPosition[1] = hPosition[1];
            tPosition[0]++;
          } else {
            // console.log("else", { hPosition, tPosition });
          }
        }
      } else if (direction === "U") {
        hPosition[1]++;
        if (!isSamePosition(hPosition, tPosition)) {
          if (isTwoStepsAway(hPosition, tPosition)) {
            // tPosition = oldHPosition;
            tPosition[1]++;
          } else if (notTouchingAndNotInSameRowOrColumn(hPosition, tPosition)) {
            // console.log("notTouchingAndNotInSameRowOrColumn");
            tPosition[0] = hPosition[0];
            tPosition[1]++;
          } else {
            // console.log("else", { hPosition, tPosition });
          }
        }
      } else if (direction === "D") {
        hPosition[1]--;
        if (!isSamePosition(hPosition, tPosition)) {
          if (isTwoStepsAway(hPosition, tPosition)) {
            // tPosition = oldHPosition;

            tPosition[1]--;
          } else if (notTouchingAndNotInSameRowOrColumn(hPosition, tPosition)) {
            // console.log("notTouchingAndNotInSameRowOrColumn");
            tPosition[0] = hPosition[0];
            tPosition[1]--;
          } else {
            // console.log("else", { hPosition, tPosition });
          }
        }
      }
      // console.log({ hPosition, tPosition });
      positionsList.push(tPosition.join("|"));
      print(hPosition, tPosition);
    }
    lastDirection = direction;
  }
  const set = [...new Set(positionsList)];
  console.log(set);
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
// { exampleResult: 21, puzzleResult: 1843 }
