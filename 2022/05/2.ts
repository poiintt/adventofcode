import { readFile } from "fs/promises";

const input = await readFile("./puzzle.txt");

const result = input.toString().split("\n\n");

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
console.log(result2.join(""));
