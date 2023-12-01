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

  const sum = input
    .split("\n")
    .map((line) => {
      let firstDigit: number | null = null;
      let lastDigit: number | null = null;
      const letters = line.split("");
      for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const num = Number(letter);
        if (!isNaN(num)) {
          if (firstDigit === null) {
            firstDigit = num;
            lastDigit = num;
          } else {
            lastDigit = num;
          }
        } else {
          for (let j = 0; j < numberWords.length; j++) {
            const numberWord = numberWords[j];

            const numberWordLetters = numberWord.split("");

            for (let k = 0; k < numberWordLetters.length; k++) {
              const numberWordLetter = numberWordLetters[k];
              const currentLetter = letters[i + k];
              if (currentLetter == null || numberWordLetter !== currentLetter) {
                break;
              } else if (numberWordLetters.length - 1 === k) {
                const digit = j + 1;
                if (firstDigit === null) {
                  firstDigit = digit;
                  lastDigit = digit;
                } else {
                  lastDigit = digit;
                }
              }
            }
          }
        }
      }
      return firstDigit! * 10 + lastDigit!;
    })
    .reduce((acc, curr) => acc + curr, 0);
  return sum;
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
