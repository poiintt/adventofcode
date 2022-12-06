import { readFile } from "fs/promises";

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

    if (opponent) {
      let me = opponent;
      if (meEncoded === "X") {
        me = hands[opponent][3];
      } else if (meEncoded === "Z") {
        me = Object.entries(hands).find((s) => s[1][3] === opponent)![0];
      }

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

const example = await readFile("./example.txt", { encoding: "utf8" });
const puzzle = await readFile("./puzzle.txt", { encoding: "utf8" });

console.time("example");
const exampleResult = getResult(example);
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
