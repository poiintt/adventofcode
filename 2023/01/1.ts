import { file } from "bun";

function getResult(input: string) {
  const sum = input
    .split("\n")
    .map((line) => {
      let firstDigit: number | null = null;
      let lastDigit: number | null = null;
      for (const letter of line.split("")) {
        const num = Number(letter);
        if (!isNaN(num)) {
          if (firstDigit === null) {
            firstDigit = num;
            lastDigit = num;
          } else {
            lastDigit = num;
          }
        }
      }
      return firstDigit! * 10 + lastDigit!;
    })
    .reduce((acc, curr) => acc + curr, 0);
  return sum;
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
