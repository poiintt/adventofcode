import { readFile } from "fs/promises";

function getResult(input: string) {
  const instructions = input.split("\n");

  const cycles = [1];
  for (const instruction of instructions) {
    const currentValue = cycles.at(-1)!;
    if (instruction === "noop") {
      cycles.push(currentValue);
    } else if (instruction.startsWith("addx")) {
      const [_, valueText] = instruction.split(" ");
      const value = parseInt(valueText);
      cycles.push(...[currentValue, currentValue + value]);
    }
  }

  const screen: string[][] = [];
  for (let cycleIndex = 0; cycleIndex < cycles.length; cycleIndex++) {
    const screenRow = Math.floor(cycleIndex / 40);
    if (screen[screenRow] == null) {
      screen[screenRow] = [];
    }

    const drawPixel = [-1, 0, +1]
      .map(
        (offset) => cycleIndex + offset - 40 * screenRow === cycles[cycleIndex]
      )
      .includes(true);

    if (drawPixel) {
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