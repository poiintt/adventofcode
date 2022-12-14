import { readFile } from "fs/promises";

function getResult(input: string) {
  const packetPairs = input
    .split("\n\n")
    .map((packetPair) => packetPair.split("\n"));

  const rightOrderIndices: number[] = [];

  type NumberOrArray = number | number[] | NumberOrArray[];
  function recurse(
    left: NumberOrArray,
    right: NumberOrArray
  ): boolean | undefined {
    // console.log(JSON.stringify(left), "vs", JSON.stringify(right));
    if (Array.isArray(left) && Array.isArray(right)) {
      const length = left.length >= right.length ? left.length : right.length;
      for (let i = 0; i < length; i++) {
        if (left[i] != null && right[i] != null) {
          const r = recurse(left[i], right[i]);
          if (r != null) return r;
        } else if (left[i] == null && right[i] != null) {
          return true;
        } else if (left[i] != null && right[i] == null) {
          return false;
        }
      }
    } else if (Array.isArray(left) && !Array.isArray(right)) {
      const r = recurse(left, [right]);
      if (r != null) return r;
    } else if (!Array.isArray(left) && Array.isArray(right)) {
      const r = recurse([left], right);
      if (r != null) return r;
    } else {
      if (left < right) {
        return true;
      } else if (left > right) {
        return false;
      }
    }
  }

  for (const [pairIndex, [leftText, rightText]] of packetPairs.entries()) {
    const left = JSON.parse(leftText);
    const right = JSON.parse(rightText);

    const result = recurse(left, right);
    if (result === true) {
      rightOrderIndices.push(pairIndex + 1);
    }
  }
  const sum = rightOrderIndices.reduce((acc, curr) => acc + curr, 0);

  return sum;
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
// { exampleResult: 13, puzzleResult: 5506 }
