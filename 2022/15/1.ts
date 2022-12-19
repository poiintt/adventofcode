import { file } from "bun";

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

    return {
      ...points,
      distance:
        Math.abs(points.sensor.x - points.beacon.x) +
        Math.abs(points.sensor.y - points.beacon.y),
    };
  });

  const intervals: [start: number, end: number][] = [];
  const beaconX: number[] = [];
  for (const { sensor, beacon, distance } of parsed) {
    const dx = distance - Math.abs(sensor.y - rowIndex);
    if (dx <= 0) continue;
    intervals.push([sensor.x - dx, sensor.x + dx]);

    if (beacon.y === rowIndex) {
      beaconX.push(beacon.x);
    }
  }

  const xMin = Math.min(...intervals.map(([start]) => start));
  const xMax = Math.max(...intervals.map(([_, end]) => end));

  let positionsCount = 0;
  for (let x = xMin; x <= xMax; x++) {
    if (beaconX.includes(x)) continue;

    for (const [start, end] of intervals) {
      if (start <= x && x <= end) {
        positionsCount++;
        break;
      }
    }
  }
  return positionsCount;
}

const example = await file("./example.txt").text();
const puzzle = await file("./puzzle.txt").text();

console.time("example");
const exampleResult = getResult(example, 10);
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle, 2_000_000);
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
// { exampleResult: 26, puzzleResult: 5870800 }
