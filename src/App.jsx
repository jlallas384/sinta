import { useRef, useEffect, useState } from "react";
import Map from "./Map";
import MapPicker from "./MapPicker";
import MapEditor from "./MapEditor";
import MapRoute from "./MapRoute";

import { BrowserRouter, Routes, Route} from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<MapRoute sourceNode={828} targetNode={902}/>} />
        <Route path="editor" element={<MapEditor/>} />
      </Routes>
    </BrowserRouter>
  )
  return (
      // <div
      //   style={{ height: "80vh" }}
      // >
      //   <Map width={window.innerWidth} handleClick={(pos) => console.log(pos)}/>
      // </div>
      //<MapEditor/>
      <MapRoute sourceNode={828} targetNode={902}/>
  );
}

export default App;