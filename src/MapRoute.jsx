import { useState, useMemo } from "react";
import { Line } from "react-konva";
import Map from "./Map";
import { dijkstra, getNodeById } from "./graph";


function MapRoute({sourceNode, targetNode}) {
  const path = useMemo(() => {
    return dijkstra(sourceNode, targetNode)
  }, [])

  const [mapNum, setMapNum] = useState(path[0].mapNum)
  console.log(mapNum)
  const lines = []

  let currentLine = [path[0].x, path[0].y]

  const edges = []

  for (let i = 0; i + 1 < path.length; i++) {
    edges.push([path[i], path[i + 1]])
  }
  console.log(edges)
  function canShow(node) {
    return node.mapNum === 0 || node.mapNum === mapNum
  }
  for (const edge of edges) {
    if (canShow(edge[0]) || canShow(edge[1])) {
      currentLine.push(edge[1].x, edge[1].y)
    } else {
      if (currentLine.length) {
        console.log(currentLine)
        lines.push(<Line points={currentLine} stroke='#90D5FF' strokeWidth={2} key={lines.length}/>)
        currentLine = []
      }
    }
  }


  if (currentLine.length) {
    lines.push(<Line points={currentLine} stroke='#90D5FF' strokeWidth={2} key={lines.length}/>)
    currentLine = []
  }

  console.log(lines, 'path')
  return (
    <div style={{height: "80vh"}}>
      <Map width={window.innerWidth} handleClick={() => {}} setMapNum={setMapNum}>
        { lines }
      </Map>
    </div>
  )
}

export default MapRoute;