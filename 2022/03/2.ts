import { file } from "bun";

function getResult(input: string) {
  const backpacks = input.split("\n");

  let priorities = 0;
  for (let i = 0; i < backpacks.length / 3; i++) {
    const groupBackpacks = backpacks.slice(i * 3, i * 3 + 3);

    const firstBackpackLetters = groupBackpacks[0].split("");
    const otherBackpacks = groupBackpacks.slice(1);

    const badges = firstBackpackLetters.filter((letter) =>
      otherBackpacks.every((backpack) => backpack.split("").includes(letter))
    );
    const badge = badges[0];

    if (badge.toLowerCase() === badge) {
      const prio = badge.charCodeAt(0) - 96;
      priorities += prio;
    } else {
      const prio = badge.charCodeAt(0) - 38;
      priorities += prio;
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
// { exampleResult: 70, puzzleResult: 2683 }