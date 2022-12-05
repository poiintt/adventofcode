import { readFile } from "fs/promises";

const input = (await readFile("./puzzle.txt")).toString();
const backpacks = input.split("\n");

let priorities = 0;
for (let i = 0; i < backpacks.length / 3; i++) {
  const groupBackpacks = backpacks.slice(i * 3, i * 3 + 3);

  const firstBackpackLetters = groupBackpacks[0].split("");
  const otherBackpacks = groupBackpacks.slice(1);

  const badges = firstBackpackLetters.filter((letter) =>
    otherBackpacks.every((backpack) => backpack.split("").includes(letter))
  );
  console.log({ badges });
  const badge = badges[0];

  if (badge.toLowerCase() === badge) {
    const prio = badge.charCodeAt(0) - 96;
    priorities += prio;
  } else {
    const prio = badge.charCodeAt(0) - 38;
    priorities += prio;
  }
}

console.log({ priorities });
