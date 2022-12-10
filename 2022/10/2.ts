import { readFile } from "fs/promises";

function getResult(input: string) {
  const instructions = input.split("\n");

  const cycles = [1];
  for (const instruction of instructions) {
    if (instruction === "noop") {
      cycles.push(cycles.at(-1)!);
    } else if (instruction.startsWith("addx")) {
      const [_, value] = instruction.split(" ");
      const v = parseInt(value);
      cycles.push(cycles.at(-1)!);
      cycles.push(cycles.at(-1)! + v);
    }
  }

  const screen: string[][] = [];
  for (let cycleIndex = 0; cycleIndex < cycles.length; cycleIndex++) {
    const screenRow = Math.floor(cycleIndex / 40);
    if (screen[screenRow] == null) {
      screen[screenRow] = [];
    }

    if (
      cycleIndex - 1 - 40 * screenRow === cycles[cycleIndex] ||
      cycleIndex - 40 * screenRow === cycles[cycleIndex] ||
      cycleIndex + 1 - 40 * screenRow === cycles[cycleIndex]
    ) {
      screen[screenRow].push("#");
    } else {
      screen[screenRow].push(".");
    }
  }
  const result = screen.map((row) => row.join("")).join("\n");

  return result;
}

const example = await readFile("./example.txt", { encoding: "utf8" });
const largerExample = await readFile("./largerExample.txt", {
  encoding: "utf8",
});
const puzzle = await readFile("./puzzle.txt", { encoding: "utf8" });

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");
console.log(exampleResult);

console.time("largerExample");
const largerExampleResult = getResult(largerExample);
console.timeEnd("largerExample");
console.log(largerExampleResult);

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");
console.log(puzzleResult);

// [0.28ms] example
// #####.
// [0.74ms] largerExample
// ##..##..##..##..##..##..##..##..##..##..
// ###...###...###...###...###...###...###.
// ####....####....####....####....####....
// #####.....#####.....#####.....#####.....
// ######......######......######......####
// #######.......#######.......#######.....
// .
// [0.79ms] puzzle
// ####.####.###..####.#..#..##..#..#.###..
// ...#.#....#..#.#....#..#.#..#.#..#.#..#.
// ..#..###..###..###..####.#....#..#.#..#.
// .#...#....#..#.#....#..#.#.##.#..#.###..
// #....#....#..#.#....#..#.#..#.#..#.#....
// ####.#....###..#....#..#..###..##..#....
// .