import { file } from "bun";

function getResult(input: string) {
  const blueprints = input.split("\n").map((line) => {
    const p = line
      .replace("Blueprint ", "")
      .replace(": Each ore robot costs ", ",")
      .replace(" ore. Each clay robot costs ", ",")
      .replace(" ore. Each obsidian robot costs ", ",")
      .replaceAll(" ore and ", ",")
      .replace(" clay. Each geode robot costs ", ",")
      .replace(" obsidian.", "")
      .split(",")
      .map((v) => parseInt(v));
    return {
      nr: p[0],
      oreRobotCost: { ore: p[1] },
      clayRobotCost: { ore: p[2] },
      obsidianRobotCost: {
        ore: p[3],
        clay: p[4],
      },
      geodeRobotCost: {
        ore: p[5],
        obsidian: p[6],
      },
    };
  });

  return 0;
}

const example = await file("./example.txt").text();
const puzzle = await file("./puzzle.txt").text();

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");

console.time("puzzle");
// const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

// console.log({ exampleResult, puzzleResult });
// { exampleResult: , puzzleResult:  }
