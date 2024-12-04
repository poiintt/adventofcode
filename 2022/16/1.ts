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
        let newDistance =
          distances[closestNode] +
          1; /*graph[closestNode].nextValves[neighbor]*/

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
        // flowRate: 30 - parseInt(parts[1]),
        flowRate: parseInt(parts[1]),
        nextValves: parts[2].split(", "),
      },
    ];
  });

  const valvesMap = Object.fromEntries(valves);
  let workingValveNames = valves
    .filter(([_, data]) => data.flowRate > 0)
    .map(([valve]) => valve);
  // const graph2 = valves.map(([name, idk]) => [name, ])

  // Goal: shortest time to open all valves

  // const graph = {
  //   A: { B: 1, C: 4 },
  //   B: { A: 1, C: 2, D: 5 },
  //   C: { A: 4, B: 2, D: 1 },
  //   D: { B: 5, C: 1 },
  // } as const;

  // dont open valves with flowRate 0

  let minutesLeft = 30;
  let currentValve: string | null = "AA";
  let pressureRelease = 0;
  const openedValves = new Set<string>();
  for (let min = 0; min < minutesLeft; min++) {
    let nextOne: OneFlow | null = null;
    if (currentValve != null) {
      const distanceToOtherValves = dijkstra(valvesMap, currentValve);
      // console.log(distanceToOtherValves);
      const highestDistance = Math.max(
        ...Object.entries(distanceToOtherValves)
          .map(([_, distance]) => distance)
          .filter((distance) => Number.isFinite(distance))
      );
      // console.log({ highestDistance });
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
            // TODO: somehow increase time by one
            // if (currentValve === "AA") console.log("time++");
            // time++;

            continue;
          }
          if (time >= curr.distance) {
            // if (currentValve === "AA") console.log(time, curr.distance, pressure);
            pressure = pressure + curr.flowRate;
            // when this happens first time time must be increased by one
          }
          if (
            currentValve === "JJ" &&
            (curr.name === "EE" || curr.name === "HH")
          ) {
            // TODO: EE gets logged 6 times, but HH 7 times ERROR!!!!
            // console.table({
            //   name: curr.name,
            //   time,
            //   pressure,
            //   distance: curr.distance,
            //   flowRate: curr.flowRate,
            // });
          }

          calculatedFlow[i] = { ...curr, pressure };
        }
      }
      // console.log({ calculatedFlow });
      for (const oneFlow of calculatedFlow) {
        if (
          !openedValves.has(oneFlow.name) &&
          (nextOne == null || oneFlow.pressure > nextOne.pressure)
        ) {
          nextOne = oneFlow;
        }
      }
      // console.table(calculatedFlow);
    }

    if (nextOne == null) {
      currentValve = null;
    }

    if (nextOne != null) {
      currentValve = nextOne.name;
    }

    if (currentValve === "JJ") {
      // TODO: EE gets logged 6 times, but HH 7 times ERROR!!!!
    }

    const pressureBeingReleased = [...openedValves]
      .map((name) => valvesMap[name].flowRate)
      .reduce((acc, curr) => acc + curr, 0);

    // pressureRelease += pressureBeingReleased;
    console.log(`== Minute ${min + 1} ==`);
    console.log(
      `Valve ${[
        ...openedValves,
      ].toSorted()} is open, releasing ${pressureBeingReleased} pressure.`
    );
    console.log(`You move to valve ${currentValve}.`);

    if (min + 1 === 1) {
      console.assert(currentValve === "DD", "goTo DD");
    } else if (min + 1 === 4) {
      console.assert(currentValve === "BB", "goTo BB");
      console.assert(pressureBeingReleased === 20, "releasing 20 pressure");
    } else if (min + 1 === 7) {
      console.assert(currentValve === "JJ", "goTo JJ");
      console.assert(pressureBeingReleased === 33, "releasing 33 pressure");
    } else if (min + 1 === 8) {
      console.assert(currentValve === "JJ", "goTo JJ");
      console.assert(pressureBeingReleased === 33, "releasing 33 pressure");
    } else if (min + 1 === 10) {
      console.assert(currentValve === "HH", "goTo HH");
      console.assert(pressureBeingReleased === 54, "releasing 54 pressure");
    } else if (min + 1 === 13) {
      console.assert(currentValve === "HH", "goTo HH");
      console.assert(pressureBeingReleased === 54, "releasing 54 pressure");
    } else if (min + 1 === 16) {
      console.assert(currentValve === "HH", "goTo HH");
      console.assert(pressureBeingReleased === 54, "releasing 54 pressure");
    } else if (min + 1 === 22) {
      console.assert(currentValve === "CC", "goTo CC");
      console.assert(pressureBeingReleased === 79, "releasing 79 pressure");
    } else if (min + 1 === 27) {
      console.assert(currentValve === null, "stay");
      console.assert(pressureBeingReleased === 81, "releasing 81 pressure");
    }
    console.log();

    if (nextOne != null) {
      openedValves.add(nextOne.name);
      workingValveNames = workingValveNames.filter(
        (name) => !openedValves.has(name)
      );
      min += nextOne.distance;
    }
    if (nextOne == null) console.log({ min });
    const x = nextOne != null ? nextOne.distance + 1 : 1;
    for (let i = 0; i < x; i++) {
      pressureRelease += pressureBeingReleased;
    }

    // correct: A,D,B,J,H,E,C
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
console.timeEnd("puzzle");

console.log({ exampleResult, puzzleResult });
// { exampleResult: 1651, puzzleResult: 1991 }
