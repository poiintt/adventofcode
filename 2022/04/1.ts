import { readFile } from "fs/promises";

function getResult(input: string) {
  const elfPairs = input.split("\n");

  const elfs = elfPairs.map((elf) => elf.split(","));

  const sections = elfs.map((elf) =>
    elf.map((sections) =>
      sections.split("-").map((section) => parseInt(section))
    )
  );

  let result = 0;
  for (const elf of sections) {
    const firstElf = elf[0];
    const secondElf = elf[1];
    const f =
      firstElf[0] >= secondElf[0] &&
      (firstElf[1] ?? firstElf[0]) <= (secondElf[1] ?? firstElf[0]);
    const f2 =
      firstElf[0] <= secondElf[0] &&
      (firstElf[1] ?? firstElf[0]) >= (secondElf[1] ?? firstElf[0]);
    if (f || f2) {
      result++;
    }
  }
  return result;
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
