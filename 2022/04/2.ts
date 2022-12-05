import { readFile } from "fs/promises";

const input = await readFile("./puzzle.txt");

const elfPairs = input.toString().split("\n");

const elfs = elfPairs.map((elf) => elf.split(","));

const sections = elfs.map((elf) =>
  elf.map((sections) => sections.split("-").map((section) => parseInt(section)))
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

console.log(result);
