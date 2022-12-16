import { readFile } from "fs/promises";

function getResult(input: string, rowIndex: number) {
  const parsed = input.split("\n").map((line) => {
    const values = line
      .replace("Sensor at x=", "")
      .replaceAll(", y=", ",")
      .replace(": closest beacon is at x=", ",")
      .split(",");

    const ints = values.map((v) => parseInt(v));
    const points = {
      sensor: { x: ints[0], y: ints[1] },
      beacon: { x: ints[2], y: ints[3] },
    };

    return points;
  });

  const test = 0;
  // const test = 10_000_000;
  const xMin =
    Math.min(
      ...parsed.map((p) => p.sensor.x),
      ...parsed.map((p) => p.beacon.x)
    ) - test;
  const xMax =
    Math.max(
      ...parsed.map((p) => p.sensor.x),
      ...parsed.map((p) => p.beacon.x)
    ) + test;
  const yMin = Math.min(
    ...parsed.map((p) => p.sensor.y),
    ...parsed.map((p) => p.beacon.y)
  );
  const yMax = Math.max(
    ...parsed.map((p) => p.sensor.y),
    ...parsed.map((p) => p.beacon.y)
  );
  const xOffset = -xMin;
  const yOffset = -yMin;
  console.log({ xMin, xMax, yMin, yMax, xOffset, yOffset });

  // const grid: string[][] = [];
  const line = Array.from({ length: xMax + xOffset }).fill(".");
  console.log({ line: line.length });
  // console.log(line.join(""));
  // for (let y = 0; y <= yMax + yOffset; y++) {
  //   grid.push([]);
  //   for (let x = 0; x <= xMax + xOffset; x++) {
  //     grid[y][x] = ".";
  //   }
  // }
  for (const [index, p] of parsed.entries()) {
    // if (index !== 6) continue;
    // console.log(index, parsed.length);
    const sensor = { x: p.sensor.x + xOffset, y: p.sensor.y + yOffset };
    const beacon = { x: p.beacon.x + xOffset, y: p.beacon.y + yOffset };

    const distance =
      Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);

    const distanceToRowIndex = Math.abs(sensor.y - rowIndex);
    // console.log({ distance, distanceToRowIndex });
    if (distanceToRowIndex <= distance) {
      for (let i = distanceToRowIndex; i <= distance; i++) {
        // console.log(i);
        line[sensor.x + i - distanceToRowIndex] = "#";
        line[sensor.x - i + distanceToRowIndex] = "#";
      }
    }

    // for (let k = 1; k <= distance; k++) {
    //   for (let i = 0; i <= k; i++) {
    //     // console.log(i);
    //     const yDown = sensor.y + i;
    //     const xRight = sensor.x + k - i;
    //     const yUp = sensor.y - i;
    //     const xLeft = sensor.x - k + i;
    //     if (yDown === rowIndex) {
    //       line[xRight] = "#";
    //       line[xLeft] = "#";
    //     } else if (yUp === rowIndex) {
    //       line[xLeft] = "#";
    //       line[xRight] = "#";
    //     }
    //   }
    // }
    if (sensor.y === rowIndex) line[sensor.x] = "S";
    if (beacon.y === rowIndex) line[beacon.x] = "B";
  }

  // console.log(line.join(""));
  const result = line.filter((s) => s === "#").length;
  console.log({ result });
  return result;
}

const example = await readFile("./example.txt", { encoding: "utf8" });
const puzzle = await readFile("./puzzle.txt", { encoding: "utf8" });

console.time("example");
const exampleResult = getResult(example, 10);
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle, 2_000_000);
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
// { exampleResult: 26, puzzleResult:  }
