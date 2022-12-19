import { file } from "bun";

function getResult(input: string) {
  type Point = { x: number; y: number; z: number };
  const droplets = input.split("\n").map<Point>((line) => {
    const [x, y, z] = line.split(",").map((v) => parseInt(v));
    return { x, y, z };
  });

  let surfaceArea = droplets.length * 6;

  for (const a of droplets) {
    for (const b of droplets) {
      const { x, y, z } = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
      if (
        (x === 1 && y === 0 && z === 0) ||
        (x === 0 && y === 1 && z === 0) ||
        (x === 0 && y === 0 && z === 1)
      ) {
        surfaceArea -= 2;
      }
    }
  }
  return surfaceArea;
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
// { exampleResult: 64, puzzleResult: 4604 }
