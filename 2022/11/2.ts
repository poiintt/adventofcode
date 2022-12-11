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
  // console.log({ parsedMonkeys });
  const testValueProduct = parsedMonkeys.reduce((a, b) => a * b.testValue, 1);
  console.log({ testValueProduct });

  for (let magicNumber = 0; magicNumber < 1; magicNumber++) {
    // console.log({ magicNumber });
    const inspectsPerMonkey: number[] = [];
    const inspectsPerMonkeyPerRound: number[][] = [];
    for (let i = 0; i < parsedMonkeys.length; i++) {
      inspectsPerMonkey[i] = 0;
      parsedMonkeys[i].currentItems = [...parsedMonkeys[i].startingItems];
    }

    for (let round = 0; round < 10_000; round++) {
      for (const monkey of parsedMonkeys) {
        const currItems = [...monkey.currentItems];
        for (const item of currItems) {
          let worryLevel = item;

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

          // worryLevel = Math.floor(worryLevel / 3);
          // worryLevel = Math.floor(worryLevel / 7);

          // worryLevel = Math.floor(worryLevel / magicNumber);
          worryLevel = worryLevel % testValueProduct;
          // worryLevel = worryLevel - magicNumber;
          // worryLevel = worryLevel * magicNumber;
          // worryLevel = Math.round(worryLevel / magicNumber);
          // worryLevel = Math.floor(magicNumber / worryLevel);
          // worryLevel = magicNumber - worryLevel;
          // worryLevel = Math.ceil(worryLevel / magicNumber);

          // if (monkey.nr === 1 && worryLevel % monkey.testValue === 0) {
          //   worryLevel++;
          // }

          if (worryLevel % monkey.testValue === 0) {
            parsedMonkeys[monkey.nr].currentItems.shift();
            parsedMonkeys[monkey.truthyMonkeyNumber].currentItems.push(
              worryLevel
            );
          } else {
            parsedMonkeys[monkey.nr].currentItems.shift();
            parsedMonkeys[monkey.falsyMonkeyNumber].currentItems.push(
              worryLevel
            );
          }
          inspectsPerMonkey[monkey.nr]++;
        }
      }
      // console.log(parsedMonkeys.map((m) => m.currentItems));

      // if (round === 0 && magicNumber > 0) {
      //   // console.log({ inspectsPerMonkey });
      //   if (
      //     inspectsPerMonkey[0] === 2 &&
      //     inspectsPerMonkey[1] === 4 &&
      //     inspectsPerMonkey[2] === 3 &&
      //     inspectsPerMonkey[3] === 6
      //   ) {
      //     console.log(`FOUND magicNumber ${magicNumber}`);
      //     return magicNumber;
      //   } else {
      //     console.log(`magicNumber NOT ${magicNumber}`);
      //   }
      // }
      inspectsPerMonkeyPerRound[round] = inspectsPerMonkey;

      // const condi = [
      //   0, 19, 999, 1999, 2999, 3999, 4999, 5999, 6999, 7999, 8999, 9999,
      // ].includes(round);
      // if (condi) {
      //   console.log(inspectsPerMonkey);
      //   console.log(`== After round ${round + 1} ==`);
      //   console.log(
      //     inspectsPerMonkey
      //       .map((m, i) => `Monkey ${i} inspected items ${m} times.\n`)
      //       .join("")
      //   );
      // }

      // console.log(inspectetsPerMonkey);
    }
    const monkeyBusiness = [...inspectsPerMonkey]
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((acc, curr) => acc * curr, 1);
    return monkeyBusiness;
    // console.log(inspectsPerMonkeyPerRound[0].toString());
    // console.log(inspectsPerMonkeyPerRound[19].toString());
    // console.log([2, 4, 3, 6].toString());
    // console.log([99, 97, 8, 103].toString());
    // if (
    //   inspectsPerMonkeyPerRound[0].toString() === [2, 4, 3, 6].toString() &&
    //   inspectsPerMonkeyPerRound[19].toString() === [99, 97, 8, 103].toString()
    // ) {
    //   console.log(`FOUND magicNumber ${magicNumber}`);
    //   return magicNumber;
    // } else {
    //   console.log(`magicNumber NOT ${magicNumber}`);
    // }
    // console.log(parsedMonkeys.map((m) => m.currentItems));
  }
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
