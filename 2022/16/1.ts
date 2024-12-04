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
  let distances: Record<string, number> = {};
  let visited = new Set<string>();
  let nodes = Object.keys(graph);

  for (let node of nodes) {
    distances[node] = Infinity;
  }

  distances[start] = 0;

  while (nodes.length) {
    nodes.sort((a, b) => distances[a] - distances[b]);
    let closestNode = nodes.shift()!;

    // If the shortest distance to the closest node is still Infinity, then remaining nodes are unreachable and we can break
    if (distances[closestNode] === Infinity) break;

    visited.add(closestNode);

    for (const neighbor of graph[closestNode].nextValves) {
      if (!visited.has(neighbor)) {
        let newDistance = distances[closestNode] + 1;

        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
        }
      }
    }
  }

  return distances;
}

type OneFlow = {
  pressure: number;
  name: string;
  distance: number;
  flowRate: number;
};

function getResult(input: string) {
  type someType = [string, { flowRate: number; nextValves: string[] }][];
  const valves: someType = input.split("\n").map((line) => {
    const parts = line
      .replace("Valve ", "")
      .replace(" has flow rate=", ";")
      .replace(" tunnels lead to valves ", "")
      .replace(" tunnel leads to valve ", "")
      .split(";");

    return [
      parts[0],
      {
        flowRate: parseInt(parts[1]),
        nextValves: parts[2].split(", "),
      },
    ];
  });

  const valvesMap = Object.fromEntries(valves);
  let workingValveNames = valves
    .filter(([_, data]) => data.flowRate > 0)
    .map(([valve]) => valve);

  let minutesLeft = 30;
  let currentValve: string | null = "AA";
  let pressureRelease = 0;
  const openedValves = new Set<string>();
  for (let min = 0; min < minutesLeft; min++) {
    let nextOne: OneFlow | null = null;
    if (currentValve != null) {
      const distanceToOtherValves = dijkstra(valvesMap, currentValve);
      const highestDistance = Math.max(
        ...Object.entries(distanceToOtherValves)
          .map(([_, distance]) => distance)
          .filter((distance) => Number.isFinite(distance))
      );
      const calculatedFlow = workingValveNames.map((name) => ({
        pressure: 0,
        name,
        distance: distanceToOtherValves[name],
        flowRate: valvesMap[name].flowRate,
      }));

      // TODO: calculate timeLeft * flowRate to get best valve
      for (let i = 0; i < workingValveNames.length; i++) {
        for (let time = 1; time < highestDistance + 1; time++) {
          const curr = calculatedFlow[i];
          let pressure = curr.pressure;
          if (time === curr.distance + 1) {
            continue;
          }
          if (time >= curr.distance) {
            pressure = pressure + curr.flowRate;
          }

          calculatedFlow[i] = { ...curr, pressure };
        }
      }
      for (const oneFlow of calculatedFlow) {
        if (
          !openedValves.has(oneFlow.name) &&
          (nextOne == null || oneFlow.pressure > nextOne.pressure)
        ) {
          nextOne = oneFlow;
        }
      }
    }

    if (nextOne == null) {
      currentValve = null;
    }

    if (nextOne != null) {
      currentValve = nextOne.name;
    }

    const pressureBeingReleased = [...openedValves]
      .map((name) => valvesMap[name].flowRate)
      .reduce((acc, curr) => acc + curr, 0);

    console.log(`== Minute ${min + 1} ==`);
    console.log(
      `Valve ${[
        ...openedValves,
      ].toSorted()} is open, releasing ${pressureBeingReleased} pressure.`
    );
    if (currentValve != null) console.log(`You move to valve ${currentValve}.`);
    console.log();

    if (nextOne != null) {
      openedValves.add(nextOne.name);
      workingValveNames = workingValveNames.filter(
        (name) => !openedValves.has(name)
      );
      min += nextOne.distance;
    }
    const x = nextOne != null ? nextOne.distance + 1 : 1;
    for (let i = 0; i < x; i++) {
      pressureRelease += pressureBeingReleased;
    }
  }

  return pressureRelease;
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
// { exampleResult: 1651, puzzleResult: 1991 }
