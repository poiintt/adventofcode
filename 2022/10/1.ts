import { file } from "bun";

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
      cycles.push(currentValue, currentValue + value);
    }
  }

  let signalStrengthSum = 0;
  for (let cycleNumber = 20; cycleNumber < cycles.length; cycleNumber += 40) {
    const signalStrength = cycleNumber * cycles.at(-1)!;
    signalStrengthSum += signalStrength;
  }

  return signalStrengthSum;
}

const example = await file("./example.txt").text();
const largerExample = await file("./largerExample.txt").text();
const puzzle = await file("./puzzle.txt").text();

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
