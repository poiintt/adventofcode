import { readFile } from "fs/promises";

function getResult(input: string) {
  const elfPairs = input.split("\n");

  const elfs = elfPairs.map((elf) => elf.split(","));

  const sections = elfs.map((elf) =>
    elf.map((sections) =>
      sections.split("-").map((section) => parseInt(section))
    )
  );

  function getRange(elf: number[]) {
    const result: number[] = [];
    for (let i = elf[0]; i <= elf[1]; i++) {
      result.push(i);
    }
    return result;
  }

  const ranges = sections.map((elfs) => elfs.map((elf) => getRange(elf)));

  let result = 0;
  for (const elf of ranges) {
    const firstElf = elf[0];
    const secondElf = elf[1];
    const overlaps = firstElf.some((ranges) => secondElf.includes(ranges));
    if (overlaps) {
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
// { exampleResult: 4, puzzleResult: 770 }