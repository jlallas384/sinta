import { useState } from "react";
import Map from "../components/Map";
import Fuse from "fuse.js";

import graphData from "../assets/data.json";
import { findNearestNode, getNodeById } from "../graph";

import startPinImage from "../assets/start.svg";
import endPinImage from "../assets/end.svg";

import useImage from "use-image";
import { Image, Line } from "react-konva";

import { dijkstra } from "../graph";

import { Link } from "react-router";

const fuse = new Fuse(graphData.landmarks, {
  keys: ["name"],
  threshold: 0.3,
});

function StartPin({ x, y }) {
  const SIZE = 7.5;
  const [startPin] = useImage(startPinImage);

  return (
    <Image
      image={startPin}
      x={x - SIZE / 2}
      y={y - SIZE / 2}
      width={SIZE}
      height={SIZE}
    />
  );
}

function EndPin({ x, y }) {
  const SIZE_X = 6.4;
  const SIZE_Y = 8.8;
  const [endPin] = useImage(endPinImage);

  return (
    <Image
      image={endPin}
      x={x - SIZE_X / 2}
      y={y - SIZE_Y}
      width={SIZE_X}
      height={SIZE_Y}
    />
  );
}

function ShortestRoute() {
  const [activeInput, setActiveInput] = useState(0);
  const [focus, setFocus] = useState(false);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState([]);

  const [sourceNode, setSourceNode] = useState(null);
  const [destinationNode, setDestinationNode] = useState(null);
  const [mapNum, setMapNum] = useState(0);

  function onChange(e) {
    const value = e.target.value;
    const results = fuse.search(value);
    setResults(results.map((x) => x.item));
  }

  function handleClick(pos) {
    if (activeInput == 0) {
      return;
    }

    const node = findNearestNode(pos, mapNum);
    if (activeInput == 1) {
      setSourceNode(node);
      setSource(node.name || `${node.x} ${node.y}`);
    } else {
      setDestinationNode(node);
      setDestination(node.name || `${node.x} ${node.y}`);
    }
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
    <div className="h-screen flex flex-col">
      <div className="flex flex-col items-center py-5 gap-3 w-full bg-white">
        {(activeInput == 0 || activeInput == 1) && (
          <div className="flex items-center gap-3 w-11/12 max-w-xl">
            <div className="w-6">
              {activeInput == 1 && (
                <button
                  className="block cursor-pointer"
                  onClick={() => {
                    setActiveInput(0);
                  }}
                >
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
                </button>
              )}

              {activeInput == 0 && (
                <Link to="/" className="block cursor-pointer">
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
              )}
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
                onPointerDown={(e) => {
                  if (activeInput != 1) {
                    e.preventDefault();
                  } else {
                    setFocus(true);
                    setResults([]);
                  }
                  setActiveInput(1);
                }}
                onBlur={() => {
                  setFocus(false);
                }}
              />
            </div>
            <div className="w-6">
              <svg
                className="invisible"
                width="17"
                height="21"
                viewBox="0 0 17 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.1818 15.4997L11.1818 20.4997L6.18176 15.4997L7.60676 14.0997L10.1818 16.6747L10.1818 9.49969H12.1818L12.1818 16.6747L14.7568 14.0997L16.1818 15.4997ZM10.1818 5.49969L8.75676 6.89969L6.18176 4.32469L6.18176 11.4997H4.18176L4.18176 4.32469L1.60676 6.89969L0.181763 5.49969L5.18176 0.499695L10.1818 5.49969Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
        )}

        {(activeInput == 0 || activeInput == 2) && (
          <div className="flex items-center gap-3 w-11/12 max-w-xl">
            <div className="w-6">
              <button
                className={`block cursor-pointer ${
                  activeInput == 2 ? "" : "invisible"
                }`}
                onClick={() => {
                  setActiveInput(0);
                }}
              >
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
              </button>
            </div>

            <div className="flex items-center gap-2 w-full">
              <svg
                width="25"
                height="25"
                viewBox="0 0 17 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 1C10.6179 1 12.3854 1.6985 13.834 3.09277C15.2816 4.4862 16 6.17853 16 8.2002C16 9.633 15.7517 10.8013 15.2812 11.7266C14.7811 12.7102 14.1711 13.6646 13.4502 14.5898L13.4453 14.5957C12.7292 15.5435 11.9734 16.5351 11.1787 17.5693C10.3459 18.6533 9.66967 19.9829 9.1416 21.5469C9.08647 21.6928 9.00253 21.7984 8.88672 21.8789C8.76914 21.9606 8.64486 22 8.5 22C8.35514 22 8.23086 21.9606 8.11328 21.8789C8.02652 21.8186 7.95747 21.7444 7.90527 21.6494L7.8584 21.5469C7.33067 19.9837 6.66062 18.6547 5.83984 17.5713C5.05597 16.5366 4.29417 15.5448 3.55469 14.5957C2.85381 13.6681 2.24657 12.7105 1.7334 11.7227C1.25328 10.7984 1.00002 9.63158 1 8.2002C1 6.17853 1.71836 4.4862 3.16602 3.09277C4.61461 1.6985 6.38207 1 8.5 1ZM8.5 4.9502C7.58774 4.9502 6.79096 5.26882 6.13672 5.89844C5.48187 6.52873 5.14258 7.30485 5.14258 8.2002C5.14263 9.09542 5.48198 9.87075 6.13672 10.501C6.791 11.1307 7.58764 11.4502 8.5 11.4502C9.41236 11.4502 10.209 11.1307 10.8633 10.501C11.518 9.87075 11.8574 9.09542 11.8574 8.2002C11.8574 7.30485 11.5181 6.52873 10.8633 5.89844C10.209 5.26882 9.41226 4.9502 8.5 4.9502Z"
                  fill="#ED1C24"
                  stroke="black"
                />
              </svg>
              <input
                value={destination}
                onChange={(e) => {
                  onChange(e);
                  setDestination(e.target.value);
                }}
                type="text"
                placeholder="Destination"
                className="border-1 border-black rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-red-400"
                onPointerDown={(e) => {
                  if (activeInput != 2) {
                    e.preventDefault();
                  } else {
                    setFocus(true);
                    setResults([]);
                  }
                  setActiveInput(2);
                }}
                onBlur={() => {
                  setFocus(false);
                }}
              />
            </div>

            <div className="w-6">
              <button
                className="block cursor-pointer"
                onPointerDown={() => {
                  setSourceNode(destinationNode);
                  setDestinationNode(sourceNode);

                  setSource(destination);
                  setDestination(source);
                }}
              >
                <svg
                  className={`${activeInput == 0 ? "" : "invisible"}`}
                  width="17"
                  height="21"
                  viewBox="0 0 17 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.1818 15.4997L11.1818 20.4997L6.18176 15.4997L7.60676 14.0997L10.1818 16.6747L10.1818 9.49969H12.1818L12.1818 16.6747L14.7568 14.0997L16.1818 15.4997ZM10.1818 5.49969L8.75676 6.89969L6.18176 4.32469L6.18176 11.4997H4.18176L4.18176 4.32469L1.60676 6.89969L0.181763 5.49969L5.18176 0.499695L10.1818 5.49969Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 relative items-center justify-center">
        {activeInput !== 0 && focus && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl bg-white shadow-lg rounded-b-md overflow-hidden border border-gray-200">
            {results.slice(0, 5).map(({ name, id }, i, arr) => (
              <div
                key={i}
                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                  i < arr.length - 1 ? "border-b border-gray-200" : ""
                }`}
                onPointerDown={(e) => {
                  const node = getNodeById(id);
                  if (activeInput == 1) {
                    setSourceNode(node);
                    setSource(node.name);
                  } else {
                    setDestinationNode(node);
                    setDestination(node.name);
                  }
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

          {sourceNode && <StartPin {...sourceNode} />}

          {destinationNode && <EndPin {...destinationNode} />}
        </Map>
      </div>
    </div>
  );
}

export default ShortestRoute;
