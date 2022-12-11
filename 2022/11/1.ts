import { readFile } from "fs/promises";

function getResult(input: string) {
  const monkeyTexts = input.split("\n\n");
  const monkeys = monkeyTexts.map((monkey, i) => {
    const line = monkey.split("\n");
    const itemsText = line[1].split("  Starting items: ")[1];
    const items = itemsText.split(",").map((val) => parseInt(val));

    const operationLine = line[2].split("  Operation: new = old ")[1];
    const [operation, operationValueText] = operationLine.split(" ");
    const operationValue = parseInt(operationValueText);

    const testLine = line[3].split("  Test: ")[1];
    const testValueText = testLine.split(" by ")[1];
    const testValue = parseInt(testValueText);

    const truthyMonkeyNumberText = line[4].split(
      "    If true: throw to monkey "
    )[1];
    const truthyMonkeyNumber = parseInt(truthyMonkeyNumberText);

    const falsyMonkeyNumberText = line[5].split(
      "    If false: throw to monkey "
    )[1];
    const falsyMonkeyNumber = parseInt(falsyMonkeyNumberText);

    return {
      nr: i,
      items,
      operation,
      operationValue,
      testValue,
      truthyMonkeyNumber,
      falsyMonkeyNumber,
    };
  });

  const inspectsPerMonkey = monkeys.map(() => 0);

  for (let index = 0; index < 20; index++) {
    for (const monkey of monkeys) {
      const currItems = [...monkey.items];
      for (const item of currItems) {
        let worryLevel = item;
        inspectsPerMonkey[monkey.nr]++;

        let operationValue = monkey.operationValue;
        if (isNaN(monkey.operationValue)) {
          operationValue = item;
        }

        if (monkey.operation === "+") {
          worryLevel += operationValue;
        } else if (monkey.operation === "*") {
          worryLevel *= operationValue;
        }

        worryLevel = Math.floor(worryLevel / 3);

        if (worryLevel % monkey.testValue === 0) {
          monkeys[monkey.nr].items.shift();
          monkeys[monkey.truthyMonkeyNumber].items.push(worryLevel);
        } else {
          monkeys[monkey.nr].items.shift();
          monkeys[monkey.falsyMonkeyNumber].items.push(worryLevel);
        }
      }
    }
  }

  const monkeyBusiness = inspectsPerMonkey
    .sort((a, z) => z - a)
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
