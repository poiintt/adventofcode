import { readFile } from "fs/promises";

function getResult(input: string) {
  const datastreams = input.split("\n");
  const results: number[] = [];

  for (const datastream of datastreams) {
    const lastFour: string[] = [];
    for (let i = 0; i < datastream.length; i++) {
      const char = datastream[i];
      lastFour.push(char);

      if (lastFour.length > 14) {
        lastFour.shift();

        const res = lastFour.every((letter, i, arr) => {
          for (const [i2, x] of arr.entries()) {
            if (i !== i2 && x === letter) {
              return false;
            }
          }
          return true;
        });
        if (res) {
          results.push(i + 1);
          break;
        }
      }
    }
  }
  return results;
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
// { exampleResult: [ 19, 23, 23, 29, 26 ], puzzleResult: [ 3263 ] }