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
  const rockPoints: Point[] = [];

  for (const rockPath of parsed) {
    let i = 0;
    let rock = rockPath[i];

    while (true) {
      rockPoints.push({ x: rock.x, y: rock.y });

      if (i === rockPath.length - 1) {
        break;
      }

      const { x, y } = rock;
      const nextX = rockPath[i + 1].x;
      const nextY = rockPath[i + 1].y;

      let dx = 0;
      let dy = 0;
      if (nextX - x > 0) {
        dx = +1;
      } else if (nextX - x < 0) {
        dx = -1;
      }
      if (nextY - y > 0) {
        dy = +1;
      } else if (nextY - y < 0) {
        dy = -1;
      }

      if (x === nextX && y === nextY) {
        i++;
      }
      rock = {
        x: x + dx,
        y: y + dy,
      };
    }
  }

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
  }

  let restingSandCount = 0;
  outer: while (true) {
    let sandPoint = { x: sandPos.x, y: sandPos.y };

    while (true) {
      const x = sandPoint.x;
      const xMinusOffset = sandPoint.x - xMin;
      const y = sandPoint.y;

      if (grid[y + 1] == null) {
        break outer;
      }

      const below = grid[y + 1][xMinusOffset];
      if (below == null) {
        break outer;
      } else if (below === ".") {
        sandPoint = { x: x, y: y + 1 };
        continue;
      }

      const left = grid[y + 1][xMinusOffset - 1];
      if (left == null) {
        break outer;
      } else if (left === ".") {
        sandPoint = { x: x - 1, y: y + 1 };
        continue;
      }

      const right = grid[y + 1][xMinusOffset + 1];
      if (right == null) {
        break outer;
      } else if (right === ".") {
        sandPoint = { x: x + 1, y: y + 1 };
        continue;
      }

      grid[y][xMinusOffset] = "o";
      restingSandCount++;
      break;
    }

    if (sandPoint.y > yMax) {
      break;
    }
  }
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
