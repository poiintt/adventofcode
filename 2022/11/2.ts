import { file } from "bun";

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
  const testValueProduct = monkeys.reduce((a, b) => a * b.testValue, 1);
  const inspectsPerMonkey = monkeys.map(() => 0);

  for (let round = 0; round < 10_000; round++) {
    for (const monkey of monkeys) {
      const currItems = [...monkey.items];
      let operationValue = monkey.operationValue;
      const nan = isNaN(monkey.operationValue);

      for (const item of currItems) {
        let worryLevel = item;

        if (nan) {
          operationValue = worryLevel;
        }

        if (monkey.operation === "+") {
          worryLevel += operationValue;
        } else if (monkey.operation === "*") {
          worryLevel *= operationValue;
        }
        worryLevel = worryLevel % testValueProduct;

        if (worryLevel % monkey.testValue === 0) {
          monkeys[monkey.nr].items.shift();
          monkeys[monkey.truthyMonkeyNumber].items.push(worryLevel);
        } else {
          monkeys[monkey.nr].items.shift();
          monkeys[monkey.falsyMonkeyNumber].items.push(worryLevel);
        }
        inspectsPerMonkey[monkey.nr]++;
      }
    }
  }
  const monkeyBusiness = inspectsPerMonkey
    .sort((a, z) => z - a)
    .slice(0, 2)
    .reduce((acc, curr) => acc * curr, 1);
  return monkeyBusiness;
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
// { exampleResult: 2713310158, puzzleResult: 23641658401 }
