import { file, write } from "bun";

async function getResult(input: string) {
  type Point = { x: number; y: number; z: number };
  const droplets = input.split("\n").map<Point>((line) => {
    const [x, y, z] = line.split(",").map((v) => parseInt(v));
    return { x, y, z };
  });
  // console.log({ dropletsBefore: droplets.length });
  // const max = droplets.length * 6;

  const maxX = Math.max(...droplets.map((p) => p.x)) + 2;
  const maxY = Math.max(...droplets.map((p) => p.y)) + 2;
  const maxZ = Math.max(...droplets.map((p) => p.z)) + 2;
  // const min = Math.min(
  //   ...droplets.map((p) => p.x),
  //   ...droplets.map((p) => p.y),
  //   ...droplets.map((p) => p.z)
  // );
  // console.log({ min });

  // add point inside of droplet

  const getNeighbors = (droplet: Point) => {
    return [
      { x: +1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: +1, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 0, y: 0, z: +1 },
      { x: 0, y: 0, z: -1 },
    ].map((d) => ({
      x: droplet.x + d.x,
      y: droplet.y + d.y,
      z: droplet.z + d.z,
    }));
  };

  // or -1
  const min = -1;
  const queue = [{ x: min, y: min, z: min }];
  const outsidePoints: Point[] = [];
  const done: Point[] = [];
  let count = 0;
  // console.log(droplets);
  while (queue.length) {
    console.log(count++, queue.length);
    // console.log({ queue });
    const p = queue.shift()!;

    if (done.some((d) => d.x === p.x && d.y === p.y && d.z === p.z)) {
      // console.log("done");
      continue;
    }
    outsidePoints.push(p);

    for (const neighbor of getNeighbors(p)) {
      // console.log({ neighbor });
      if (
        neighbor.x < min ||
        neighbor.y < min ||
        neighbor.z < min ||
        neighbor.x > maxX ||
        neighbor.y > maxY ||
        neighbor.z > maxZ
      ) {
        // console.log("boundary");
        continue;
      } else if (
        outsidePoints.some(
          (d) => d.x === neighbor.x && d.y === neighbor.y && d.z === neighbor.z
        )
      ) {
        // console.log("outsidePoints");
        continue;
      } else if (
        droplets.some(
          (d) => d.x === neighbor.x && d.y === neighbor.y && d.z === neighbor.z
        )
      ) {
        // console.log("droplets");
        continue;
      }
      // console.log(outsidePoints);
      // console.log(2, neighbor);
      else queue.push(neighbor);
    }
    done.push(p);
  }
  // console.log("after");
  const m1 = Math.max(...outsidePoints.map((p) => p.x));
  const m2 = Math.max(...outsidePoints.map((p) => p.y));
  const m3 = Math.max(...outsidePoints.map((p) => p.z));
  // console.log(outsidePoints);
  // console.log({ m1, m2, m3 });

  // for (let x = -1; x < maxX; x++) {
  //   for (let y = -1; y < maxY; y++) {
  //     for (let z = -1; z < maxZ; z++) {
  //       const xAxis = droplets.filter(
  //         (d) => d.x !== x && d.y === y && d.z === z
  //       );
  //       const yAxis = droplets.filter(
  //         (d) => d.x === x && d.y !== y && d.z === z
  //       );
  //       const zAxis = droplets.filter(
  //         (d) => d.x === x && d.y === y && d.z !== z
  //       );

  //       const xOutsideDroplet =
  //         xAxis.every((d) => d.x > x) || xAxis.every((d) => d.x < x);
  //       const yOutsideDroplet =
  //         yAxis.every((d) => d.y > y) || yAxis.every((d) => d.y < y);
  //       const zOutsideDroplet =
  //         zAxis.every((d) => d.z > z) || zAxis.every((d) => d.z < z);
  //       if (x === 15 && y === 14 && z === 4) {
  //         console.log({ xOutsideDroplet, yOutsideDroplet, zOutsideDroplet });
  //         console.log(xAxis.map((p) => p.x));
  //         console.log(yAxis.map((p) => p.y));
  //         console.log(zAxis.map((p) => p.z));
  //       }
  //       if (
  //         (xOutsideDroplet || yOutsideDroplet || zOutsideDroplet) &&
  //         droplets.every((d) => d.x !== x || d.y !== y || d.z !== z)
  //       ) {
  //         outsidePoints.push({ x, y, z });
  //         // break;
  //       }
  //     }
  //   }
  // }

  // console.log({
  //   gridSize: maxX * maxY * maxZ,
  //   outsidePoints: outsidePoints.length,
  //   minus: maxX * maxY * maxZ - outsidePoints.length,
  //   droplets: droplets.length,
  // });
  // console.log(outsidePoints);

  const max = droplets.length * 6;

  // console.log({ max });
  let surfaceArea = 0;

  let newC = 0;

  const list: Point[] = [];
  for (let i = 0; i < droplets.length; i++) {
    const a = droplets[i];
    let countPerPoint = 0;

    for (let j = 0; j < outsidePoints.length; j++) {
      const b = outsidePoints[j];
      if (
        (a.x === b.x && a.y === b.y && a.z + 1 === b.z) ||
        (a.x === b.x && a.y === b.y && a.z - 1 === b.z) ||
        (a.x === b.x && a.y + 1 === b.y && a.z === b.z) ||
        (a.x === b.x && a.y - 1 === b.y && a.z === b.z) ||
        (a.x + 1 === b.x && a.y === b.y && a.z === b.z) ||
        (a.x - 1 === b.x && a.y === b.y && a.z === b.z)
      ) {
        surfaceArea++;
        countPerPoint++;

        if (!list.some((c) => c.x === a.x && c.y === a.y && c.z === a.z)) {
          list.push(a);
        }
      }

      // const d = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
      // if (
      //   (d.x === 1 && d.y === 0 && d.z === 0) ||
      //   (d.x === 0 && d.y === 1 && d.z === 0) ||
      //   (d.x === 0 && d.y === 0 && d.z === 1)
      // ) {
      //   surfaceArea++;
      // }
    }
    // console.log(a.x, a.y, a.z, countPerPoint);
  }
  console.log({ list: list.length });
  await write("./2.txt", JSON.stringify(list));
  console.log(surfaceArea);
  console.log({ newC });

  // let count = 0;
  // let count2 = 0;

  // const getNeighbors = (droplet: Point) => {
  //   return [
  //     { x: +1, y: 0, z: 0 },
  //     { x: -1, y: 0, z: 0 },
  //     { x: 0, y: +1, z: 0 },
  //     { x: 0, y: -1, z: 0 },
  //     { x: 0, y: 0, z: +1 },
  //     { x: 0, y: 0, z: -1 },
  //   ].map((d) => ({
  //     x: droplet.x + d.x,
  //     y: droplet.y + d.y,
  //     z: droplet.z + d.z,
  //   }));
  // };

  // for (const droplet of droplets) {
  //   const nextDroplets: [Point, Point][] = [
  //     { x: +1, y: 0, z: 0 },
  //     { x: -1, y: 0, z: 0 },
  //     { x: 0, y: +1, z: 0 },
  //     { x: 0, y: -1, z: 0 },
  //     { x: 0, y: 0, z: +1 },
  //     { x: 0, y: 0, z: -1 },
  //   ].map((d) => [
  //     {
  //       x: droplet.x + d.x,
  //       y: droplet.y + d.y,
  //       z: droplet.z + d.z,
  //     },
  //     {
  //       x: droplet.x + 2 * d.x,
  //       y: droplet.y + 2 * d.y,
  //       z: droplet.z + 2 + d.z,
  //     },
  //   ]);

  //   for (const nextDroplet of nextDroplets) {
  //     if (
  //       !droplets.some(
  //         (o) =>
  //           (nextDroplet[0].x === o.x &&
  //             nextDroplet[0].y === o.y &&
  //             nextDroplet[0].z === o.z) ||
  //           (nextDroplet[1].x === o.x &&
  //             nextDroplet[1].y === o.y &&
  //             nextDroplet[1].z === o.z)
  //       )
  //     ) {
  //       count++;
  //     } else {
  //       // console.log(droplet.x, droplet.y, droplet.z);
  //     }
  //   }
  // }
  // surfaceArea = count;
  // console.log({ count });

  // for (let i = 0; i < droplets.length; i++) {
  //   const a = droplets[i];
  //   for (let j = 0; j < droplets.length; j++) {
  //     const b = droplets[j];
  //     const d = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  //     if (
  //       (d.x === 1 && d.y === 0 && d.z === 0) ||
  //       (d.x === 0 && d.y === 1 && d.z === 0) ||
  //       (d.x === 0 && d.y === 0 && d.z === 1)
  //     ) {
  //       surfaceArea -= 2;
  //     }
  //   }
  // }

  // const f: Point[] = [
  //   { x: +1, y: 0, z: 0 },
  //   { x: -1, y: 0, z: 0 },
  //   { x: 0, y: +1, z: 0 },
  //   { x: 0, y: -1, z: 0 },
  //   { x: 0, y: 0, z: +1 },
  //   { x: 0, y: 0, z: -1 },
  // ];

  // let surf = innerDroplets.length * 6;
  // console.log({ surf });
  // for (let i = 0; i < innerDroplets.length; i++) {
  //   const a = innerDroplets[i];
  //   for (let j = 0; j < innerDroplets.length; j++) {
  //     const b = innerDroplets[j];
  //     const d = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  //     if (
  //       (d.x === 1 && d.y === 0 && d.z === 0) ||
  //       (d.x === 0 && d.y === 1 && d.z === 0) ||
  //       (d.x === 0 && d.y === 0 && d.z === 1)
  //     ) {
  //       surf -= 2;
  //     }
  //   }
  // }
  // console.log(surfaceArea, surf);
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

// missing
// {
//   x: 15,
//   y: 14,
//   z: 4
// }
// {
//   x: 14,
//   y: 15,
//   z: 4
// }
// {
//   x: 9,
//   y: 9,
//   z: 2
// }
// {
//   x: 15,
//   y: 15,
//   z: 5
// }
// {
//   x: 16,
//   y: 15,
//   z: 4
// }
