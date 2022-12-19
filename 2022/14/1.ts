import { file } from "bun";

function getResult(input: string) {
  let xMin = Infinity;
  let xMax = 0;
  let yMin = 0;
  let yMax = 0;
  const parsed = input.split("\n").map((line) =>
    line.split(" -> ").map((cord) => {
      const [xText, yText] = cord.split(",");
      const x = parseInt(xText);
      const y = parseInt(yText);

      if (xMin == Infinity || x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;

      return { x, y } as Point;
    })
  );
  console.log({ xMin, xMax, yMin, yMax });
  const rockPoints: Point[] = [];

  for (const rockPath of parsed) {
    let i = 0;
    let rock = rockPath[i];

    while (true) {
      rockPoints.push({ x: rock.x, y: rock.y });

      if (i === rockPath.length - 1) {
        break;
      }

      const currX = rock.x;
      const nextX = rockPath[i + 1].x;
      const currY = rock.y;
      const nextY = rockPath[i + 1].y;

      let dx = 0;
      let dy = 0;
      if (nextX - currX > 0) {
        dx = +1;
      } else if (nextX - currX < 0) {
        dx = -1;
      }
      if (nextY - currY > 0) {
        dy = +1;
      } else if (nextY - currY < 0) {
        dy = -1;
      }

      if (currX === nextX && currY === nextY) {
        i++;
      }
      rock = {
        x: currX + dx,
        y: currY + dy,
      };
    }
  }
  console.log({ l: rockPoints.length });

  type Point = { x: number; y: number };

  const sandPos: Point = { x: 500, y: 0 };

  const grid: string[][] = [];
  for (let y = yMin; y <= yMax; y++) {
    grid[y] = [];
    for (let x = xMin; x <= xMax; x++) {
      if (x === sandPos.x && y === sandPos.y) {
        grid[y].push("+");
      } else if (rockPoints.some((p) => p.x === x && p.y === y)) {
        grid[y].push("#");
      } else {
        grid[y].push(".");
      }
    }
    console.log(grid[y].join(""));
  }
  // console.log(grid);

  function print(point: Point) {
    console.log();
    for (let y = 0; y < grid.length; y++) {
      let line = "";
      for (let x = 0; x < grid[0].length; x++) {
        if (x === point.x - xMin && y === point.y) {
          line += "@";
        } else {
          line += grid[y][x];
        }
      }
      console.log(line);
    }
  }

  let restingSandCount = 0;
  let count = 0;
  while (true) {
    count++;
    // console.log(count);
    let sandPoint = { x: sandPos.x, y: sandPos.y };
    let count2 = 0;
    let fullBreak = false;

    while (true) {
      count2++;
      // console.log({ count2 });
      const x = sandPoint.x;
      const xMinusOffset = sandPoint.x - xMin;
      const y = sandPoint.y;

      if (grid[y + 1] == null) {
        // console.log(y + 1);
        // print(sandPoint);
        fullBreak = true;
        break;
      }

      const below = grid[y + 1][xMinusOffset];
      if (below == null) {
        fullBreak = true;
        break;
      } else if (below === ".") {
        sandPoint = { x: x, y: y + 1 };
        continue;
      }

      const left = grid[y + 1][xMinusOffset - 1];
      if (left == null) {
        fullBreak = true;
        break;
      } else if (left === ".") {
        sandPoint = { x: x - 1, y: y + 1 };
        continue;
      }

      const right = grid[y + 1][xMinusOffset + 1];
      if (right == null) {
        fullBreak = true;
        break;
      } else if (right === ".") {
        sandPoint = { x: x + 1, y: y + 1 };
        continue;
      }

      grid[y][xMinusOffset] = "o";
      restingSandCount++;
      // console.log(grid.map((l) => l.join("")).join("\n"));
      break;
    }
    console.log({ restingSandCount });
    // print(sandPoint);

    if (fullBreak || sandPoint.y > yMax) {
      // console.log(sandPoint.x - xMin);
      print(sandPoint);
      break;
    }
  }
  // console.log(grid.map((l) => l.join("")).join("\n"));
  console.log({ yMax });
  return restingSandCount;
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
// { exampleResult: 24, puzzleResult: 779 }
