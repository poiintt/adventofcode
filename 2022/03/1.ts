import { file } from "bun";

function getResult(input: string) {
  const rucksacks = input.split("\n");

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
        priorities += prio;
      } else {
        const prio = letter.charCodeAt(0) - 38;
        priorities += prio;
      }
    }
  }
  return priorities;
}

const example = await file("./example.txt").text();
const puzzle = await file("./puzzle.txt").text();

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
// { exampleResult: 157, puzzleResult: 7831 }