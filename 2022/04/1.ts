import { readFile } from "fs/promises";

function getResult(input: string) {
  return input
    .split("\n")
    .map((elfs) =>
      elfs
        .split(",")
        .map((timeSpan) =>
          timeSpan.split("-").map((number) => parseInt(number))
        )
    )
    .reduce((pairs, elf) => {
      const firstElf = elf[0];
      const secondElf = elf[1];

      const firstElfEnd = firstElf[1] ?? firstElf[0];
      const secondElfEnd = secondElf[1] ?? firstElf[0];

      const firstTimeSpanInSecond =
        firstElf[0] >= secondElf[0] && firstElfEnd <= secondElfEnd;
      const secondTimeSpanInFirst =
        firstElf[0] <= secondElf[0] && firstElfEnd >= secondElfEnd;
      if (firstTimeSpanInSecond || secondTimeSpanInFirst) {
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
// { exampleResult: 2, puzzleResult: 464 }
