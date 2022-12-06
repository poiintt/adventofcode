import { readFile } from "fs/promises";

function getRange(elf: number[]) {
  const result: number[] = [];
  for (let i = elf[0]; i <= elf[1]; i++) {
    result.push(i);
  }
  return result;
}

function getResult(input: string) {
  return input
    .split("\n")
    .map((elfs) =>
      elfs.split(",").map((timeSpan) => {
        const range = timeSpan.split("-").map((number) => parseInt(number));
        return getRange(range);
      })
    )
    .reduce((pairs, elf) => {
      const overlaps = elf[0].some((ranges) => elf[1].includes(ranges));
      if (overlaps) {
        pairs++;
      }
      return pairs;
    }, 0);
}

const example = await readFile("./example.txt", { encoding: "utf8" });
const puzzle = await readFile("./puzzle.txt", { encoding: "utf8" });

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
// { exampleResult: 4, puzzleResult: 770 }
