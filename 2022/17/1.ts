import { file } from "bun";

function getResult(input: string, rockTypes: string) {
  const hotGasJets = input.split("");

  const width = 7;

  const emptyLine = Array<string>(width).fill(".");
  const grid: string[][] = [];

  const rocks = rockTypes.split("\n\n").map((rock) => rock.split("\n"));

  type DistancePoint = { dx: number; dy: number };

  const distances = rocks.map((rock) => {
    const left: DistancePoint[] = [];
    const right: DistancePoint[] = [];
    const bottom: DistancePoint[] = [];
    const all: DistancePoint[] = [];

    rock.reverse();
    for (const [y, line] of rock.entries()) {
      const letters = line.split("");

      for (const [x, letter] of letters.entries()) {
        const dPoint = { dx: x, dy: y };
        if (letter === "#") {
          if (left[y] == null) {
            left[y] = dPoint;
          }
          if (bottom[x] == null) {
            bottom[x] = dPoint;
          }
          right[y] = dPoint;
          all.push(dPoint);
        }
      }
    }

    return { left, right, bottom, all, height: rock.length };
  });

  let gasJetNumber = 0;

  const distanceFromLeft = 2;
  const distanceFromBottom = 3;
  let firstRockPoint: { x: number; y: number } = {
    x: distanceFromLeft,
    y: 3,
  };

  const print = () => {
    for (let i = grid.length - 1; i >= 0; i--) {
      console.log(grid[i].join(""));
    }
  };
  // 2022

  let towerHeight = 0;
  for (let round = 0; round < 2022; round++) {
    let kind: "falling" | "gettingPushed" = "gettingPushed";
    firstRockPoint.x = 2;
    const rockNumber = round % 5;

    const rockDistance = distances[rockNumber];
    // const b = towerHeight + 3 + rockDistance.height - grid.length;
    const b = firstRockPoint.y + rockDistance.height - grid.length;
    // console.log("beginTest", towerHeight, grid.length, "+", b);
    // print();
    for (let t = 0; t < 3; t++) {
      grid.push([...emptyLine]);
    }

    for (const ü of rockDistance.all) {
      const x = firstRockPoint.x + ü.dx;
      const y = firstRockPoint.y + ü.dy;
      if (grid[y] == null) {
        grid[y] = [...emptyLine];
      }
      grid[y][x] = "@";
    }

    // console.log();
    // console.log(`Rock ${round + 1} begins falling`);
    // print();

    const getAbsolutPoint = (point: DistancePoint) => ({
      x: firstRockPoint.x + point.dx,
      y: firstRockPoint.y + point.dy,
    });

    while (true) {
      if (kind === "gettingPushed") {
        const direction = hotGasJets[gasJetNumber];
        if (direction === "<") {
          let canMove = true;
          for (const d of rockDistance.left) {
            const { x, y } = getAbsolutPoint(d);
            if (grid[y][x - 1] !== ".") {
              canMove = false;
              break;
            }
          }
          if (canMove) {
            // console.log();
            // console.log("Jet of gas pushes rock left:");
            for (const p of rockDistance.all) {
              const { x, y } = getAbsolutPoint(p);
              grid[y][x] = ".";
            }
            for (const p of rockDistance.all) {
              const { x, y } = getAbsolutPoint(p);
              grid[y][x - 1] = "@";
            }
            firstRockPoint.x--;
          } else {
            // console.log();
            // console.log("Jet of gas pushes rock left, but nothing happens:");
          }
          // print();
        } else if (direction === ">") {
          let canMove = true;
          for (const d of rockDistance.right) {
            const { x, y } = getAbsolutPoint(d);
            if (grid[y][x + 1] !== ".") {
              canMove = false;
              break;
            }
          }
          if (canMove) {
            // console.log();
            // console.log("Jet of gas pushes rock right:");
            for (const p of rockDistance.all) {
              const { x, y } = getAbsolutPoint(p);
              grid[y][x] = ".";
            }
            for (const p of rockDistance.all) {
              const { x, y } = getAbsolutPoint(p);
              grid[y][x + 1] = "@";
            }
            firstRockPoint.x++;
          } else {
            // console.log();
            // console.log("Jet of gas pushes rock right, but nothing happens:");
          }
          // print();
        }

        if (gasJetNumber === hotGasJets.length - 1) {
          gasJetNumber = 0;
        } else {
          gasJetNumber++;
        }
        kind = "falling";
      } else if (kind === "falling") {
        let canMove = true;
        // console.log(rockDistance.bottom);
        if (round === 2) {
          // console.log(rockDistance.bottom);
        }
        for (const d of rockDistance.bottom) {
          const { x, y } = getAbsolutPoint(d);

          if (grid[y - 1] == null) {
            canMove = false;
            break;
          } else if (grid[y - 1][x] === "#") {
            canMove = false;
            break;
          }
        }
        if (canMove) {
          // console.log();
          // console.log("Rock falls 1 unit:");
          for (const p of rockDistance.all) {
            const { x, y } = getAbsolutPoint(p);
            grid[y][x] = ".";
          }
          for (const p of rockDistance.all) {
            const { x, y } = getAbsolutPoint(p);
            grid[y - 1][x] = "@";
          }
          firstRockPoint.y--;
          // print();
        } else {
          // console.log();
          // console.log("Rock falls 1 unit, causing it to come to rest:");
          for (const p of rockDistance.all) {
            const { x, y } = getAbsolutPoint(p);
            grid[y][x] = "#";
          }

          // print();

          // for (let q = grid.length - 1; q <= 0; q--) {
          //   // console.log(grid[q]);
          //   if (grid[q].includes("#")) {
          //     towerHeight = q + 1;
          //   }
          // }
          // console.log(
          //   "end",
          //   towerHeight,
          //   firstRockPoint.y,
          //   rockDistance.height
          // );
          // print();
          // console.log({ firstRockPoint }, rockDistance.height);
          if (firstRockPoint.y + rockDistance.height > towerHeight) {
            towerHeight = firstRockPoint.y + rockDistance.height;
          }
          // console.log({ towerHeight });
          // console.log("towerHeigt = ", towerHeight);
          firstRockPoint.y = towerHeight + 3;
          break;
        }

        kind = "gettingPushed";
      }
    }
  }
  // console.log({ test: towerHeight });
  // console.log(towerHeight);
  return towerHeight;
}

const rockTypes = await file("./rockTypes.txt").text();
const example = await file("./example.txt").text();
const puzzle = await file("./puzzle.txt").text();

console.time("example");
const exampleResult = getResult(example, rockTypes);
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle, rockTypes);
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
// { exampleResult: 3068, puzzleResult: 3191}
