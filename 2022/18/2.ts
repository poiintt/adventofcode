import { file } from "bun";

function getResult(input: string) {
  type Point = { x: number; y: number; z: number };
  const droplets = input.split("\n").map<Point>((line) => {
    const [x, y, z] = line.split(",").map((v) => parseInt(v));
    return { x, y, z };
  });

  const offset = 1;
  const maxX = Math.max(...droplets.map((p) => p.x)) + offset;
  const maxY = Math.max(...droplets.map((p) => p.y)) + offset;
  const maxZ = Math.max(...droplets.map((p) => p.z)) + offset;
  const min = -offset;

  const isSamePoint = (p1: Point, p2: Point) =>
    p1.x === p2.x && p1.y === p2.y && p1.z === p2.z;

  const getNeighbors = ({ x, y, z }: Point) => {
    return [
      { x: x + 1, y, z },
      { x: x - 1, y, z },
      { x, y: y + 1, z },
      { x, y: y - 1, z },
      { x, y, z: z + 1 },
      { x, y, z: z - 1 },
    ];
  };

  const queue = [{ x: min, y: min, z: min }];
  const outsidePoints: Point[] = [];
  let done = new Set<string>();

  while (queue.length) {
    const point = queue.shift()!;

    const key = `${point.x},${point.y},${point.z}`;
    if (done.has(key)) continue;
    outsidePoints.push(point);
    done.add(key);

    for (const neighbor of getNeighbors(point)) {
      const { x, y, z } = neighbor;
      if (x < min || y < min || z < min || x > maxX || y > maxY || z > maxZ) {
        continue;
      } else if (droplets.some((p) => isSamePoint(p, neighbor))) {
        continue;
      }
      queue.push(neighbor);
    }
  }

  let surfaceArea = 0;
  for (const droplet of droplets) {
    for (const { x, y, z } of outsidePoints) {
      if (
        (droplet.x === x && droplet.y === y && droplet.z + 1 === z) ||
        (droplet.x === x && droplet.y === y && droplet.z - 1 === z) ||
        (droplet.x === x && droplet.y + 1 === y && droplet.z === z) ||
        (droplet.x === x && droplet.y - 1 === y && droplet.z === z) ||
        (droplet.x + 1 === x && droplet.y === y && droplet.z === z) ||
        (droplet.x - 1 === x && droplet.y === y && droplet.z === z)
      ) {
        surfaceArea++;
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
// { exampleResult: 58, puzzleResult: 2604 }
