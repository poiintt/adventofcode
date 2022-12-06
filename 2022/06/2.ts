import { readFile } from "fs/promises";

const input = await readFile("./puzzle.txt");

const datastreams = input.toString().split("\n");

for (const datastream of datastreams) {
  const lastFour: string[] = [];
  for (let i = 0; i < datastream.length; i++) {
    const char = datastream[i];
    lastFour.push(char);

    if (lastFour.length > 14) {
      lastFour.shift();

      const res = lastFour.every((letter, i, arr) => {
        for (const [i2, x] of arr.entries()) {
          if (i !== i2 && x === letter) {
            return false;
          }
        }
        return true;
      });
      if (res) {
        console.log(i + 1);
        break;
      }
    }
  }
}
