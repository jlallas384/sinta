import { Link, useNavigate } from "react-router";
import Map from "../components/Map";
import { useEffect, useState } from "react";

import { StartPin } from "../components/Pins";
import { getNodeById } from "../graph";

function Lost() {
  const [mapNum, setMapNum] = useState(0);

  const [pins, setPins] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    async function req() {
      const response = await fetch("/api/lost");
      const json = await response.json();

      setPins(json);
    }
    req();
  }, []);
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

      <Map width={window.innerWidth} setMapNum={setMapNum} handleClick={() => {}}>
        {
          pins
          .map(({ nodeid, itemid }) => {
            return { node: getNodeById(nodeid), itemid };
          })
          .filter(({ node }) => node.mapNum == 0 || node.mapNum == mapNum)
          .map(({node, itemid}) => {
            return <StartPin x={node.x} y={node.y} onPointerDown={
              () => {
                navigate(`${itemid}`)
              }
            }/>
          })
        }
      </Map>
    </div>
  );
}

export default Lost;
