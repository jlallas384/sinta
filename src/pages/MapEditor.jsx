import { useState, useRef, useMemo } from "react";
import { Circle, Line } from "react-konva";
import Map from "../components/Map";

function MapEditor() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [landmarks, setLandmarks] = useState([]);

  const [mapNum, setMapNum] = useState(0);
  const [mapWidth, setMapWidth] = useState(0);
  const [mode, setMode] = useState("add-node");
  const [config, setConfig] = useState("");
  const [activeNode, setActiveNode] = useState(null);

  const [landmarkName, setLandmarkName] = useState("");

  const states = useRef({
    nodeId: 0,
    edgeId: 0,
  });

  function findLandmark(id) {
    return landmarks.find((landmark) => landmark.id == id);
  }

  function changeActiveNode(id) {
    setActiveNode(id);
    if (id !== null) {
      const landmark = findLandmark(id);
      if (landmark) {
        setLandmarkName(landmark.name);
      } else {
        setLandmarkName("");
      }
    }
  }

  function handleClick(pos) {
    if (mode == "add-node") {
      setNodes([...nodes, { ...pos, id: states.current.nodeId++, mapNum }]);
    }
    changeActiveNode(null);
  }

  function onChange(e) {
    setMode(e.target.id);
  }

  function getNodeById(id) {
    return nodes.find((node) => node.id == id);
  }

  function createEdge(node1id, node2id) {
    const node1 = getNodeById(node1id);
    const node2 = getNodeById(node2id);

    setEdges([
      ...edges,
      {
        node1id: node1.id,
        node2id: node2.id,
        mapNum:
          node1.mapNum != node2.mapNum
            ? [node1.mapNum, node2.mapNum]
            : [node1.mapNum],
        id: states.current.edgeId++,
      },
    ]);
  }

  function importConfig() {
    const json = JSON.parse(config);
    console.log(json);
    states.current.nodeId =
      json.nodes.reduce((max, { id }) => Math.max(max, id), 0) + 1;
    setNodes(json.nodes);

    states.current.edgeId =
      json.edges.reduce((max, { id }) => Math.max(max, id), 0) + 1;
    setEdges(json.edges);

    setLandmarks(json.landmarks);
  }

  function exportConfig() {
    const json = JSON.stringify({
      nodes,
      edges,
      landmarks,
    });
    setConfig(json);
  }

  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => node.mapNum == mapNum)
  }, [nodes, mapNum])

  const nodeElements = useMemo(() => {
    return filteredNodes
      .map(({ x, y, id }) => {
        return (
          <Circle
            x={x}
            y={y}
            stroke={(() => {
              if (activeNode == id) return "#88E788";
              if (findLandmark(id)) return "#FF474D";
              return "#90D5FF";
            })()}
            strokeWidth={0.5}
            fill="white"
            width={1.5}
            key={id}
            onClick={(e) => {
              if (mode == "add-node") {
                if (e.evt.button == 2) {
                  setEdges(
                    edges.filter(
                      ({ node1id, node2id }) => node1id != id && node2id != id
                    )
                  );
                  setNodes(nodes.filter((node) => node.id !== id));
                }
              } else if (mode == "add-edge") {
                if (e.evt.button == 0) {
                  if (activeNode == id) {
                    changeActiveNode(null);
                  } else {
                    if (activeNode === null) {
                      changeActiveNode(id);
                    } else {
                      createEdge(id, activeNode);
                      changeActiveNode(null);
                    }
                  }
                }
              } else {
                if (e.evt.button == 0) {
                  changeActiveNode(activeNode == id ? null : id);
                }
              }
            }}
          />
        );
      });
  }, [filteredNodes, landmarks, activeNode, mode]);

  const filteredEdges = useMemo(() => {
    return edges
      .filter((edge) => edge.mapNum[0] == mapNum || edge.mapNum[1] == mapNum)
  }, [edges, mapNum])

  const edgeElements = useMemo(() => {
      return filteredEdges
      .map(({ node1id, node2id, id }) => {
        const node1 = nodes.find(({ id }) => id == node1id);
        const node2 = nodes.find(({ id }) => id == node2id);

        return (
          <Line
            points={[node1.x, node1.y, node2.x, node2.y]}
            stroke="#90D5FF"
            strokeWidth={1}
            key={id}
            onClick={(e) => {
              if (mode == "add-edge" && e.evt.button == 0) {
                setEdges(edges.filter((edge) => edge.id != id));
              }
            }}
          />
        );
      });
  }, [filteredNodes, filteredEdges, mode]);
  
  return (
    <div className="h-screen flex">
      <div
        ref={(node) => {
          if (node) {
            setMapWidth(node.offsetWidth);
          }
        }}
        className="w-4/5 h-screen"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Map width={mapWidth} setMapNum={setMapNum} handleClick={handleClick}>
          {edgeElements}

          {nodeElements}
        </Map>
      </div>
      <div className="w-1/5 p-5 bg-blue-400">
        <div className="flex items-center mb-4">
          <input
            checked={mode == "add-node"}
            onChange={onChange}
            id="add-node"
            name="mode"
            type="radio"
            className="accent-blue-700 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="add-node"
            className="ms-2 text-sm font-medium text-white"
          >
            Add Node
          </label>
        </div>
        <div className="flex items-center mb-4">
          <input
            checked={mode == "add-edge"}
            onChange={onChange}
            id="add-edge"
            name="mode"
            type="radio"
            className="accent-blue-700  w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="add-edge"
            className="ms-2 text-sm font-medium text-white"
          >
            Add Edge
          </label>
        </div>
        <div className="flex items-center">
          <input
            checked={mode == "add-landmark"}
            onChange={onChange}
            id="add-landmark"
            name="mode"
            type="radio"
            className="accent-blue-700  w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="add-landmark"
            className="ms-2 text-sm font-medium text-white"
          >
            Add Landmark
          </label>
        </div>

        {activeNode !== null && mode == "add-landmark" && (
          <>
            <input
              value={landmarkName}
              onChange={(e) => setLandmarkName(e.target.value)}
              type="text"
              className="w-full bg-white mt-4 p-2"
              placeholder="Enter Name"
            />

            <button
              className="w-full text-white bg-blue-700 p-2 mt-2 rounded-md cursor-pointer hover:bg-blue-500 transition"
              onClick={() => {
                setLandmarks([
                  ...landmarks.filter(({ id }) => id != activeNode),
                  {
                    name: landmarkName,
                    id: activeNode,
                  },
                ]);
                setActiveNode(null);
              }}
            >
              Set Landmark Name
            </button>
          </>
        )}

        <textarea
          onChange={(e) => {
            setConfig(e.target.value);
          }}
          value={config}
          className="text-xs p-4 w-full mt-4 bg-white rounded-md"
          rows={10}
        />

        <button
          className="w-full text-white bg-blue-700 p-2 rounded-md cursor-pointer hover:bg-blue-500 transition"
          onClick={importConfig}
        >
          Import
        </button>
        <button
          className="w-full text-white bg-blue-700 p-2 mt-2 rounded-md cursor-pointer hover:bg-blue-500 transition"
          onClick={exportConfig}
        >
          Export
        </button>
      </div>
    </div>
  );
}

export default MapEditor;
