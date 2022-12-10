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
  let result = 0;
  for (let i = 20; i < cycles.length; i += 40) {
    const signalStrength = i * cycles[i - 1];
    result += signalStrength;
  }

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

console.time("largerExample");
const largerExampleResult = getResult(largerExample);
console.timeEnd("largerExample");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ exampleResult, largerExampleResult, puzzleResult });
// { exampleResult: 0, largerExampleResult: 13140, puzzleResult: 15680 }
