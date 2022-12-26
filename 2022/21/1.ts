import { file } from "bun";

function getResult(input: string) {
  const monkeys = input.split("\n").map((line) => {
    const [name, right] = line.split(": ");
    const operation = right.split(" ");
    if (operation.length === 1) {
      return { name, number: parseInt(operation[0]) };
    }
    return {
      name,
      monkey1: operation[0],
      operant: operation[1],
      monkey2: operation[2],
    };
  });

  function getMonkeyNumber(name: string): number {
    const monkey = monkeys.find((l) => l.name === name);
    if (monkey?.number) {
      return monkey.number;
    } else if (monkey?.monkey1 && monkey.monkey2) {
      const first = getMonkeyNumber(monkey.monkey1);
      const second = getMonkeyNumber(monkey.monkey2);
      if (monkey.operant === "+") {
        return first + second;
      } else if (monkey.operant === "-") {
        return first - second;
      } else if (monkey.operant === "*") {
        return first * second;
      } else if (monkey.operant === "/") {
        return first / second;
      }
    }
    throw new Error("missing input");
  }
  return getMonkeyNumber("root");
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
// { exampleResult: 152, puzzleResult: 331319379445180 }
