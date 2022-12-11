import { readFile } from "fs/promises";

function getResult(input: string) {
  const monkeys = input.split("\n\n");
  const parsedMonkeys = monkeys.map((monkey, i) => {
    const line = monkey.split("\n");
    const [_, startingItemsText] = line[1].split("  Starting items: ");
    const startingItems = startingItemsText
      .split(",")
      .map((val) => parseInt(val));

    const [__, operationLine] = line[2].split("  Operation: new = old ");
    const [operation, operationValueText] = operationLine.split(" ");
    const operationValue = parseInt(operationValueText);

    const [___, testLine] = line[3].split("  Test: ");
    const [testOperation, testValueText] = testLine.split(" by ");
    const testValue = parseInt(testValueText);

    const [____, truthyMonkeyNumberText] = line[4].split(
      "    If true: throw to monkey "
    );
    const truthyMonkeyNumber = parseInt(truthyMonkeyNumberText);

    const [_____, falsyMonkeyNumberText] = line[5].split(
      "    If false: throw to monkey "
    );
    const falsyMonkeyNumber = parseInt(falsyMonkeyNumberText);

    return {
      nr: i,
      startingItems,
      currentItems: [...startingItems],
      operation,
      operationValue,
      testOperation,
      testValue,
      truthyMonkeyNumber,
      falsyMonkeyNumber,
    };
  });

  const inspectetsPerMonkey: number[] = [];
  for (let i = 0; i < parsedMonkeys.length; i++) {
    inspectetsPerMonkey[i] = 0;
  }

  for (let index = 0; index < 20; index++) {
    for (const monkey of parsedMonkeys) {
      const yeet = [...monkey.currentItems];
      for (const item of yeet) {
        let worryLevel = item;
        inspectetsPerMonkey[monkey.nr]++;

        let operationValue = monkey.operationValue;
        if (isNaN(monkey.operationValue)) {
          operationValue = item;
        }

        if (monkey.operation === "+") {
          worryLevel += operationValue;
        } else if (monkey.operation === "-") {
          worryLevel -= operationValue;
        } else if (monkey.operation === "*") {
          worryLevel *= operationValue;
        } else if (monkey.operation === "/") {
          worryLevel /= operationValue;
        }

        worryLevel = Math.floor(worryLevel / 3);

        if (worryLevel % monkey.testValue === 0) {
          parsedMonkeys[monkey.nr].currentItems.shift();
          parsedMonkeys[monkey.truthyMonkeyNumber].currentItems.push(
            worryLevel
          );
        } else {
          parsedMonkeys[monkey.nr].currentItems.shift();
          parsedMonkeys[monkey.falsyMonkeyNumber].currentItems.push(worryLevel);
        }
      }
    }
  }

  const monkeyBusiness = inspectetsPerMonkey
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((acc, curr) => acc * curr, 1);
  return monkeyBusiness;
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
// { exampleResult: 10605, puzzleResult: 102399 }
