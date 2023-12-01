import { file } from "bun";

function getResult(input: string) {
  const numberWords = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  const sums = input
    .split("\n")
    .map((a) => {
      let first = "";
      let last = "";
      const letters = a.split("");
      for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        console.log(letter);
        if (!isNaN(Number(letter))) {
          if (first === "") {
            first = letter;
            last = letter;
          } else {
            last = letter;
          }
        } else {
          for (let j = 0; j < numberWords.length; j++) {
            const numberWord = numberWords[j];
            for (let k = 0; k < numberWord.split("").length; k++) {
              const numberWordLetter = numberWord.split("")[k];
              if (letters[i + k] == null || numberWordLetter !== letters[i + k])
                break;
              else if (numberWord.split("").length - 1 === k) {
                if (first === "") {
                  first = String([j + 1]);
                  last = String([j + 1]);
                } else {
                  last = String([j + 1]);
                }
              }
            }
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

const example = await file("./example2.txt").text();
const puzzle = await file("./puzzle.txt").text();

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
// { exampleResult: 281, puzzleResult: 55701 }
