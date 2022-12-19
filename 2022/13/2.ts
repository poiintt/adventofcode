import { file } from "bun";

function getResult(input: string) {
  const packetPairs = input.split("\n").filter((l) => l !== "");
  packetPairs.push("[[2]]", "[[6]]");

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

  packetPairs.sort((aText, zText) => {
    const a = JSON.parse(aText);
    const z = JSON.parse(zText);
    const result = recurse(z, a);
    if (result === true) return 1;
    else if (result === false) return -1;
    else return 0;
  });

  const divider2 = packetPairs.findIndex((packet) => packet === "[[2]]");
  const divider6 = packetPairs.findIndex((packet) => packet === "[[6]]");
  const decoderKey = (divider2 + 1) * (divider6 + 1);

  return decoderKey;
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
// { exampleResult: 140, puzzleResult: 21756 }
