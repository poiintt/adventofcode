import { file } from "bun";

function getResult(input: string) {
  const sums = input
    .split("\n")
    .map((a) => {
      let first = "";
      let last = "";
      for (const letter of a.split("")) {
        console.log(letter);
        if (!isNaN(Number(letter))) {
          if (first === "") {
            first = letter;
            last = letter;
          } else {
            last = letter;
          }
        }
      }
      console.log(a, `${first}${last}`);
      return Number(`${first}${last}`);
    })
    .reduce((acc, curr) => acc + curr, 0);
  console.log(sums);
  return sums;
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
// { exampleResult: 142, puzzleResult: 56397 }
