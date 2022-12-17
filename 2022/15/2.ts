import { readFile } from "fs/promises";

function getResult(input: string) {
  const lines = input.split("\n").map((line) => {
    const values = line
      .replace("Sensor at x=", "")
      .replaceAll(", y=", ",")
      .replace(": closest beacon is at x=", ",")
      .split(",");

    const ints = values.map((v) => parseInt(v));
    const points: { sensor: Point; beacon: Point } = {
      sensor: { x: ints[0], y: ints[1] },
      beacon: { x: ints[2], y: ints[3] },
    };

    return {
      ...points,
      distance:
        Math.abs(points.sensor.x - points.beacon.x) +
        Math.abs(points.sensor.y - points.beacon.y),
    };
  });

  type Point = { x: number; y: number };

  const positiveLines: number[] = [];
  const negativeLines: number[] = [];

  for (const line of lines) {
    const xSensor = line.sensor.x;
    let yIntercept = xSensor + line.sensor.y;
    positiveLines.push(yIntercept - line.distance, yIntercept + line.distance);

    yIntercept = xSensor - line.sensor.y;
    negativeLines.push(yIntercept - line.distance, yIntercept + line.distance);
  }

  let positive = 0;
  let negative = 0;

  for (let i = 0; i < lines.length * 2; i++) {
    for (let j = i + 1; j < lines.length * 2; j++) {
      const a = positiveLines[i];
      const b = positiveLines[j];

      if (Math.abs(a - b) === 2) {
        positive = Math.min(a, b) + 1;
      }

      const c = negativeLines[i];
      const d = negativeLines[j];

      if (Math.abs(c - d) === 2) {
        negative = Math.min(c, d) + 1;
      }
    }
  }

  const distressBeaconPoint: Point = {
    x: (positive + negative) / 2,
    y: (positive - negative) / 2,
  };
  const turningFrequency =
    distressBeaconPoint.x * 4_000_000 + distressBeaconPoint.y;

  return turningFrequency;
}

// const example = await readFile("./example.txt", { encoding: "utf8" });
const puzzle = await readFile("./puzzle.txt", { encoding: "utf8" });

// console.time("example");
// const exampleResult = getResult(example);
// console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ /* exampleResult,*/ puzzleResult });
// { exampleResult: 56000011, puzzleResult: 10908230916597 }
