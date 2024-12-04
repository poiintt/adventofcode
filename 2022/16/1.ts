import { file } from "bun";

function dijkstra(
  graph: Record<
    string,
    {
      flowRate: number;
      nextValves: string[];
    }
  >,
  start: string
) {
  const distances: Record<string, number> = {};
  const visited = new Set<string>();
  const nodes = Object.keys(graph);

  for (const node of nodes) {
    distances[node] = Infinity;
  }

  distances[start] = 0;

  while (nodes.length) {
    nodes.sort((a, b) => distances[a] - distances[b]);
    const closestNode = nodes.shift()!;

    // If the shortest distance to the closest node is still Infinity, then remaining nodes are unreachable and we can break
    if (distances[closestNode] === Infinity) break;

    visited.add(closestNode);

    for (const neighbor of graph[closestNode].nextValves) {
      if (!visited.has(neighbor)) {
        const newDistance = distances[closestNode] + 1;

        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
        }
      }
    }
  }

  return distances;
}

type Valve = {
  name: string;
  distance: number;
  flowRate: number;
};

function getResult(input: string) {
  const valves = input.split("\n").map((line) => {
    const [name, rateString, valveNamesString] = line
      .replace("Valve ", "")
      .replace(" has flow rate=", ";")
      .replace(" tunnels lead to valves ", "")
      .replace(" tunnel leads to valve ", "")
      .split(";");

    return [
      name,
      {
        flowRate: parseInt(rateString),
        nextValves: valveNamesString.split(", "),
      },
    ] as const;
  });

  const valvesObj = Object.fromEntries(valves);
  let workingValveNames = valves
    .filter(([_, data]) => data.flowRate > 0)
    .map(([valve]) => valve);

  let totalPressure = 0;
  const openValves = new Set<string>();

  let currentValve: Valve | null = {
    name: "AA",
    distance: Infinity,
    flowRate: -Infinity,
  };
  for (let minute = 0; minute < 30; minute++) {
    if (currentValve?.name != null) {
      const distanceToOtherValves = dijkstra(valvesObj, currentValve.name);
      const highestDistance = Math.max(
        ...Object.entries(distanceToOtherValves).map(
          ([_, distance]) => distance
        )
      );

      const getPressureForValveName = (name: string) => {
        const distance = distanceToOtherValves[name];
        const flowRate = valvesObj[name].flowRate;

        if (highestDistance === distance) return flowRate;
        return (highestDistance - distance) * flowRate;
      };

      const possibleNextValves = workingValveNames.toSorted(
        (a, z) => getPressureForValveName(z) - getPressureForValveName(a)
      );

      const nextValveName = possibleNextValves.at(0);
      if (nextValveName != null) {
        currentValve = {
          distance: distanceToOtherValves[nextValveName],
          flowRate: valvesObj[nextValveName].flowRate,
          name: nextValveName,
        };
      } else {
        currentValve = null;
      }
    }

    const pressureBeingReleased = [...openValves]
      .map((name) => valvesObj[name].flowRate)
      .reduce((acc, curr) => acc + curr, 0);
    if (currentValve != null) {
      openValves.add(currentValve.name);
      workingValveNames = workingValveNames.filter(
        (name) => !openValves.has(name)
      );
      minute += currentValve.distance;
    }

    // console.log(`== Minute ${minute + 1} ==`);
    // console.log(
    //   `Valve ${[
    //     ...openValves,
    //   ].toSorted()} is open, releasing ${pressureBeingReleased} pressure.`
    // );
    // if (currentValve != null) console.log(`You move to valve ${currentValve.name}.`);
    // console.log();

    const maxTime = currentValve != null ? currentValve.distance + 1 : 1;
    for (let i = 0; i < maxTime; i++) {
      totalPressure += pressureBeingReleased;
    }
  }

  return totalPressure;
}

const example = await file("example.txt").text();
const puzzle = await file("puzzle.txt").text();

console.time("example");
const exampleResult = getResult(example);
console.assert(exampleResult === 1651, "exampleResult === 1651");
console.timeEnd("example");

console.time("puzzle");
const puzzleResult = getResult(puzzle);
console.assert(puzzleResult === 1991, "puzzleResult === 1991");
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
