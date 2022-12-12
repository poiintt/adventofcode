import { readFile } from "fs/promises";

function getResult(input: string) {
  const grid = input.split("\n").map((line) => line.split(""));

  // 0,0->1,0->2,0->2,1
  // 0,0->0,1->1,1->
  const tree = {
    "0;1": { r: { "1;0": { r: "2;0" } } },
  };

  let startingPos = { x: 0, y: 0 };
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "S") {
        startingPos = { x: j, y: i };
      }
    }
  }

  // const movment: string[][] = [];
  // for (let i = 0; i < grid.length; i++) {
  //   movment[i] = [];
  //   for (let h = 0; h < grid[i].length; h++) {
  //     movment[i][h] = ".";
  //   }
  // }

  // let currentPos = startingPos;

  // let steps = 0;
  // const path: { x: number; y: number }[] = [];
  // path.push({ ...startingPos });
  // let searching = true;
  const lens: number[] = [];
  rescurse([startingPos]);
  function rescurse(currPath: { x: number; y: number }[]) {
    console.log(Math.min(...lens), currPath.length);
    // if (currPath.length > 1000) {
    //   return;
    // }
    const currentPos = { ...currPath.at(-1)! };
    const currentElevation = grid[currentPos.y][currentPos.x];
    // console.log(`STEP --------------------- ${steps}`);
    // console.log(currentElevation);

    const getDiff = (cElevation: string, cord: { x: number; y: number }) => {
      const visited = [...currPath].some(
        (c) => c.x === cord.x && c.y === cord.y
      );
      const nextElevation = grid[cord.y]?.[cord.x];

      if (visited || nextElevation == null || nextElevation === "S") {
        return null;
      }
      if (nextElevation === "E" && cElevation === "z") {
        console.log("REACHED E in");
        // searching = false;
        return 100;
      }
      if (cElevation === "S") return 1;
      const ö = nextElevation.charCodeAt(0) - cElevation.charCodeAt(0);
      if (ö > 1 || 0 > ö) return null;
      return ö;
    };
    const diffs = [
      { x: currentPos.x - 1, y: currentPos.y },
      { x: currentPos.x + 1, y: currentPos.y },
      { x: currentPos.x, y: currentPos.y - 1 },
      { x: currentPos.x, y: currentPos.y + 1 },
    ].map((cord) => getDiff(currentElevation, cord));
    if (diffs.includes(100)) {
      lens.push(currPath.length);
      return "";
    }
    // let indexOfHighestDiff: number | null = null;
    // let heighestValue: number | null = null;
    // for (let i = 0; i < diffs.length; i++) {
    //   const nextSquare = diffs[i];
    //   if (nextSquare != null) {
    //     if (heighestValue == null) {
    //       indexOfHighestDiff = i;
    //       heighestValue = nextSquare;
    //     } else if (nextSquare > heighestValue) {
    //       indexOfHighestDiff = i;
    //     }
    //   }
    // }
    // console.log({ diffs, indexOfHighestDiff });
    if (diffs.every((d) => d == null)) {
      console.log("end");
      return null;
      // searching = false;
    }
    if (diffs[0] === 1) {
      // currentPos.x--;
      // console.log("<");
      // movment[currentPos.y][currentPos.x] = "<";
      // steps++;
      rescurse([...currPath, { x: currentPos.x - 1, y: currentPos.y }]);
      // currPath.push({ ...currentPos });
    }
    if (diffs[1] === 1) {
      // currentPos.x++;
      // console.log(">");
      // movment[currentPos.y][currentPos.x] = ">";
      // steps++
      rescurse([...currPath, { x: currentPos.x + 1, y: currentPos.y }]);
      // currPath.push({ ...currentPos });
    }
    if (diffs[2] === 1) {
      // currentPos.y--;
      // console.log("^");
      // movment[currentPos.y][currentPos.x] = "^";
      // steps++;
      rescurse([...currPath, { x: currentPos.x, y: currentPos.y - 1 }]);
      // currPath.push({ ...currentPos });
    }
    if (diffs[3] === 1) {
      // currentPos.y++;
      // console.log("v");
      // movment[currentPos.y][currentPos.x] = "v";
      // steps++;
      rescurse([...currPath, { x: currentPos.x, y: currentPos.y + 1 }]);
      // currPath.push({ ...currentPos });
    }
    if (diffs[0] === 0) {
      rescurse([...currPath, { x: currentPos.x - 1, y: currentPos.y }]);
    }
    if (diffs[1] === 0) {
      rescurse([...currPath, { x: currentPos.x + 1, y: currentPos.y }]);
    }
    if (diffs[2] === 0) {
      rescurse([...currPath, { x: currentPos.x, y: currentPos.y - 1 }]);
    }
    if (diffs[3] === 0) {
      rescurse([...currPath, { x: currentPos.x, y: currentPos.y + 1 }]);
    }
  }

  // while (searching) {}

  // console.log(movment.map((x) => x.join("")).join("\n"));

  const min = Math.min(...lens);

  return min;
}

const example = await readFile("./example.txt", { encoding: "utf8" });
const puzzle = await readFile("./puzzle.txt", { encoding: "utf8" });

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");

console.time("puzzle");
// const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ exampleResult /*, puzzleResult*/ });
// { exampleResult: 31, puzzleResult:  }
