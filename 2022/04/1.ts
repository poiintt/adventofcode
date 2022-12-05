import { readFile } from "fs/promises";

const input = await readFile("./puzzle.txt");

const elfPairs = input.toString().split("\n");

const elfs = elfPairs.map((elf) => elf.split(","));

const sections = elfs.map((elf) =>
  elf.map((sections) => sections.split("-").map((section) => parseInt(section)))
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

console.log(result);
