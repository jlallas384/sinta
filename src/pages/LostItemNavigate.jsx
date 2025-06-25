import { useState, useEffect } from "react";
import Map from "../components/Map";
import Fuse from "fuse.js";

import graphData from "../assets/data.json";
import { findNearestNode, getNodeById } from "../graph";

import { Line } from "react-konva";

import { dijkstra } from "../graph";
import { Link, useParams } from "react-router";

import { StartPin, EndPin } from "../components/Pins";

const fuse = new Fuse(graphData.landmarks, {
  keys: ["name"],
  threshold: 0.3,
});

function LostItemNavigate() {
  const [focus, setFocus] = useState(false);
  const [source, setSource] = useState("");
  const [results, setResults] = useState([]);

  const [sourceNode, setSourceNode] = useState(null);
  const [mapNum, setMapNum] = useState(0);

  const params = useParams()

  const [destinationNode, setDestinationNode] = useState(null)

  useEffect(() => {
    async function loadData() {
      const response = await fetch(`/api/lost/${params.itemid}`)
      const json = await response.json()
      setDestinationNode(getNodeById(json.nodeid))
    }

    loadData()
  }, [])

  function onChange(e) {
    const value = e.target.value;
    const results = fuse.search(value);
    setResults(results.map((x) => x.item));
  }

  function handleClick(pos) {
    const node = findNearestNode(pos, mapNum);
    setSourceNode(node);
    setSource(node.name || `${node.x} ${node.y}`);
  }

  function makeRoute(sourceNode, targetNode) {
    const path = dijkstra(sourceNode, targetNode);
    const lines = [];

    let currentLine = [path[0].x, path[0].y];

    const edges = [];

    for (let i = 0; i + 1 < path.length; i++) {
      edges.push([path[i], path[i + 1]]);
    }

    function canShow(node) {
      return node.mapNum === 0 || node.mapNum === mapNum;
    }
    for (const edge of edges) {
      if (canShow(edge[0]) || canShow(edge[1])) {
        currentLine.push(edge[1].x, edge[1].y);
      } else {
        if (currentLine.length) {
          lines.push(
            <Line
              points={currentLine}
              stroke="white"
              strokeWidth={2}
              key={lines.length}
              dash={[0.75, 3]}
              lineCap="round"
              lineJoin="round"
            />
          );
          currentLine = [];
        }
      }
    }

    if (currentLine.length) {
      lines.push(
        <Line
          points={currentLine}
          stroke="white"
          strokeWidth={2}
          key={lines.length}
          dash={[0.75, 3]}
          lineCap="round"
          lineJoin="round"
        />
      );
      currentLine = [];
    }

    return lines;
  }

  return (
    <div className="h-screen bg-white">
      <div className="flex flex-col" style={{ height: "90vh" }}>
        <div className="flex flex-col items-center py-5 gap-3 w-full bg-white">
          <div className="flex items-center gap-3 w-11/12 max-w-xl">
            <div className="w-6">
              <Link to={`/lost/${params.itemid}`} className="block cursor-pointer">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.3333 23.8333L6.5 13L17.3333 2.16663L19.2562 4.08954L10.3458 13L19.2562 21.9104L17.3333 23.8333Z"
                    fill="#4F4F4F"
                  />
                </svg>
              </Link>
            </div>
            <div className="flex items-center gap-2 w-full">
              <svg
                width="25"
                height="25"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="8.5" r="8" fill="white" stroke="black" />
                <path
                  d="M9.00368 2.63464C12.2504 2.62973 14.8856 5.25525 14.8905 8.49781C14.8953 11.7403 12.2682 14.3739 9.02144 14.3788C5.77473 14.3836 3.13959 11.7581 3.13464 8.51559C3.12973 5.27306 5.75694 2.63959 9.00368 2.63464Z"
                  fill="#ED1C24"
                  stroke="black"
                />
              </svg>
              <input
                value={source}
                onChange={(e) => {
                  onChange(e);
                  setSource(e.target.value);
                }}
                type="text"
                placeholder="Your Location"
                className="border-1 border-black rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-red-400"
                onFocus={() => {
                  setFocus(true);
                  setResults([]);
                }}
                onBlur={() => {
                  setFocus(false);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 relative items-center justify-center">
          {focus && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl bg-white shadow-lg rounded-b-md overflow-hidden border border-gray-200">
              {results.slice(0, 5).map(({ name, id }, i, arr) => (
                <div
                  key={i}
                  className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                    i < arr.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                  onPointerDown={(e) => {
                    const node = getNodeById(id);
                    setSourceNode(node);
                    setSource(node.name);
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
          <Map
            width={window.innerWidth}
            handleClick={handleClick}
            setMapNum={setMapNum}
          >
            {sourceNode &&
              destinationNode &&
              makeRoute(sourceNode.id, destinationNode.id)}

            {sourceNode && <StartPin x={sourceNode.x} y={sourceNode.y} />}

            {destinationNode && <EndPin x={destinationNode.x} y={destinationNode.y} />}
          </Map>
        </div>
      </div>
    </div>
  );
}

export default LostItemNavigate;
