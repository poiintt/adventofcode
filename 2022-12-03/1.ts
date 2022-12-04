import { readFile } from "fs/promises";

const allRucksacks = await readFile("./input1.txt");

const rucksacks = allRucksacks.toString().split("\n");

let priorities = 0;
for (const rucksack of rucksacks) {
  const half = rucksack.length / 2;
  const firstCompartment = rucksack.slice(0, half);
  const secondCompartment = rucksack.slice(half, rucksack.length);

  const lettersInBoth = firstCompartment
    .split("")
    .filter((l) => secondCompartment.includes(l));
  const set = [...new Set(lettersInBoth)];

  for (const letter of set) {
    if (letter.toLowerCase() === letter) {
      const prio = letter.charCodeAt(0) - 96;
      console.log({ letter, prio });
      priorities += prio;
    } else {
      const prio = letter.charCodeAt(0) - 38;
      console.log({ letter, prio });
      priorities += prio;
    }
  }
}

console.log(priorities);
