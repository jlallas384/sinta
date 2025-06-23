import { useRef, useEffect, useState } from "react";
import Map from "./Map";
import MapPicker from "./MapPicker";
import MapEditor from "./MapEditor";

function App() {

  return (
      // <div
      //   style={{ height: "80vh" }}
      // >
      //   <Map width={window.innerWidth} handleClick={(pos) => console.log(pos)}/>
      // </div>
      <MapEditor/>
  );
}

export default App;