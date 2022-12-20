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
  yMax += 1;
  const offset = yMax - yMin;
  xMin -= offset;
  xMax += offset;

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

  function print(point: Point = sandPos) {
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
  outer: while (true) {
    let sandPoint = { x: sandPos.x, y: sandPos.y };

    while (true) {
      const x = sandPoint.x;
      const xMinusOffset = sandPoint.x - xMin;
      const y = sandPoint.y;

      if (grid[y + 1] == null) {
        grid[y][xMinusOffset] = "o";
        restingSandCount++;
        break;
      }

      const below = grid[y + 1][xMinusOffset];
      if (below === ".") {
        sandPoint = { x: x, y: y + 1 };
        continue;
      }

      const left = grid[y + 1][xMinusOffset - 1];
      if (left === ".") {
        sandPoint = { x: x - 1, y: y + 1 };
        continue;
      }

      const right = grid[y + 1][xMinusOffset + 1];
      if (right === ".") {
        sandPoint = { x: x + 1, y: y + 1 };
        continue;
      }

      if (sandPoint.x === sandPos.x && sandPoint.y === sandPos.y) {
        restingSandCount++;
        break outer;
      }

      grid[y][xMinusOffset] = "o";
      restingSandCount++;
      break;
    }
  }
  // print();
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
// { exampleResult: 93, puzzleResult: 27426 }
