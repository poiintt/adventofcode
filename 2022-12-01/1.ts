import { readFile } from "fs/promises";

const input = await readFile("./puzzle.txt");

const inventories = input.toString().split("\n\n");

const x = inventories.map((inventory) =>
  inventory.split("\n").map((item) => parseInt(item))
);

const sums = x.map((inv) => inv.reduce((acc, curr) => acc + curr, 0));

const max = Math.max(...sums);
console.log(max);
