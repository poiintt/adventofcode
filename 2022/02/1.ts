import { file } from "bun";

function getResult(input: string) {
  const strategies = input.toString().split("\n");

  type Hands = "Rock" | "Paper" | "Scissors";
  const hands: Record<
    Hands,
    [opponent: string, me: string, score: number, beats: Hands]
  > = {
    Rock: ["A", "X", 1, "Scissors"],
    Paper: ["B", "Y", 2, "Rock"],
    Scissors: ["C", "Z", 3, "Paper"],
  };

  return strategies.reduce((score, curr) => {
    const [opponentEncoded, meEncoded] = curr.split(" ");

    const opponent = Object.entries(hands).find(
      (e) => e[1][0] === opponentEncoded
    )?.[0];
    const me = Object.entries(hands).find(
      (e) => e[1][1] === meEncoded
    )?.[0] as Hands;

    if (opponent && me) {
      if (opponent === me) {
        score += 3;
      } else if (hands[me][3] === opponent) {
        score += 6;
      }
      score += hands[me][2];
    }
    return score;
  }, 0);
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
// { exampleResult: 15, puzzleResult: 9651 }