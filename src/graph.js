import graphData from "./assets/data.json";

function includeLandmark(node) {
  const landmark = graphData.landmarks.find(({ id }) => node.id === id);
  if (landmark) {
    node = { ...landmark, ...node };
  }
  return node;
}

export function findNearestNode({ x, y }, mapNum) {
  let minDist = Infinity;
  let nearest = null;
  for (const node of graphData.nodes) {
    const dist = Math.hypot(node.x - x, node.y - y);
    if (dist < minDist && node.mapNum == mapNum) {
      minDist = dist;
      nearest = node;
    }
  }
  return includeLandmark(nearest);
}

export function getNodeById(id) {
  const node = graphData.nodes.find((node) => id == node.id);
  return includeLandmark(node);
}

const nodeInfos = [];

for (const node of graphData.nodes) {
  nodeInfos[node.id] = node;
}

const numNodes = nodeInfos.length;

const adjList = new Array(numNodes);

for (let i = 0; i < numNodes; i++) {
  adjList[i] = [];
}

for (const { node1id, node2id } of graphData.edges) {
  const node1 = getNodeById(node1id);
  const node2 = getNodeById(node2id);

  const distance = Math.hypot(node1.x - node2.x, node1.y - node2.y);

  adjList[node1id].push([node2id, distance]);
  adjList[node2id].push([node1id, distance]);
}

export function dijkstra(source, target) {
  const distances = new Array(numNodes);
  distances.fill(Infinity);

  distances[source] = 0;

  const queue = [[0, source]];
  const from = new Array(numNodes);

  while (true) {
    queue.sort((a, b) => a[0] - b[0]);
    const [curDist, current] = queue.shift();
    if (current == target) {
      break;
    }
    if (curDist > distances[current]) {
      continue;
    }
    for (const [next, distance] of adjList[current]) {
      const newDistance = curDist + distance;

      if (newDistance < distances[next]) {
        distances[next] = newDistance;
        from[next] = current;
        queue.push([newDistance, next]);
      }
    }
  }

  const path = [];

  let current = target;

  while (current != source) {
    path.push(nodeInfos[current]);

    current = from[current];
  }

  path.push(nodeInfos[current]);
  path.reverse();
  return path;
}
