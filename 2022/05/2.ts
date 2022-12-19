import { file } from "bun";

function getResult(input: string) {
  const result = input.split("\n\n");

  const [drawing, procedureStrings] = result.map((part) => part.split("\n"));

  const shipNumbers = drawing[drawing.length - 1];
  const cratePositions: number[] = [];

  for (let i = 0; i < shipNumbers.length; i++) {
    if (shipNumbers[i] !== "" && shipNumbers[i] !== " ") cratePositions.push(i);
  }

  const ships = cratePositions.map<string[]>(() => []);

  for (const [i, cratePos] of cratePositions.entries()) {
    for (let h = 0; h < drawing.length - 1; h++) {
      const crate = drawing[h][cratePos];
      if (crate !== " ") ships[i].unshift(crate);
    }
  }

  const procedures = procedureStrings.map((p) => {
    const texts = p.split(" ");
    return {
      move: parseInt(texts[1]),
      from: parseInt(texts[3]) - 1,
      to: parseInt(texts[5]) - 1,
    };
  });
  for (const procedure of procedures) {
    const fromShip = ships[procedure.from];
    const movingCrates = fromShip.splice(
      fromShip.length - procedure.move,
      procedure.move
    );
    ships[procedure.to].push(...movingCrates);
  }
  const result2 = ships.map((ship) => ship[ship.length - 1]);
  return result2.join("");
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
// { exampleResult: "MCD", puzzleResult: "CJVLJQPHS" }