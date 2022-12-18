import { file } from "bun";

function getResult(input: string) {
  type Point = { x: number; y: number; z: number };
  const droplets = input.split("\n").map<Point>((line) => {
    const [x, y, z] = line.split(",").map((v) => parseInt(v));
    return { x, y, z };
  });

  const max = droplets.length * 6;

  let surfaceArea = max;

  for (let i = 0; i < droplets.length; i++) {
    const a = droplets[i];
    for (let j = 0; j < droplets.length; j++) {
      const b = droplets[j];
      const d = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
      if (
        (d.x === 1 && d.y === 0 && d.z === 0) ||
        (d.x === 0 && d.y === 1 && d.z === 0) ||
        (d.x === 0 && d.y === 0 && d.z === 1)
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
