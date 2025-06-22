import { useRef, useEffect, useState } from "react";
import Map from "./Map";

function App() {

  return (
    <>
      <div
        style={{ height: "80vh" }}
      >
        <Map width={window.innerWidth}/>
      </div>
    </>
  );
}

export default App;