import { Link } from "react-router";
import Map from "../components/Map";
import { useState } from "react";

import { EndPin } from "../components/Pins";
import { findNearestNode } from "../graph";

function Found() {
  const [mapNum, setMapNum] = useState(0);

  const [node, setNode] = useState(null)

  function handleClick(pos) {
    const node = findNearestNode(pos, mapNum)
    setNode(node)
  }

  return (
    <div className="flex flex-col" style={{ height: "90vh" }}>
      <div className="py-5 px-5 w-full max-w-xl self-center">
        <Link to="/lost-and-found">
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3333 21.8333L0.5 11L11.3333 0.166664L13.2562 2.08958L4.34583 11L13.2562 19.9104L11.3333 21.8333Z"
              fill="white"
            />
          </svg>
        </Link>
      </div>

      <div className="relative h-full">
        <Map width={window.innerWidth} setMapNum={setMapNum} handleClick={handleClick}>
          {
            node && <EndPin x={node.x} y={node.y} onClick={() => setNode(null)}/>
          }
        </Map>
        {
          node &&
          <Link state={{nodeid: node.id}} to="form" className="left-1/2 transform -translate-x-1/2 absolute bottom-10 bg-yellow-300 text-center w-6/12 py-3 rounded-md font-semibold border-black border hover:bg-yellow-400">Choose this Location</Link>

        }
      </div>
    </div>
  );
}

export default Found;
