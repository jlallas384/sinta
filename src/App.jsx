import MapEditor from "./pages/MapEditor";
import ShortestRoute from "./pages/ShortestRoute"
import EmergencyRoute from "./pages/EmergencyRoute";
import Welcome from "./pages/Welcome";

import { BrowserRouter, Routes, Route} from "react-router";
import LostPin from "./pages/LostPin";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Welcome/>} />
        <Route path="shortest" element={<ShortestRoute/>} />
        <Route path="emergency" element={<EmergencyRoute/>} />
        <Route path="lost" element={<LostPin/>} />


        <Route path="editor" element={<MapEditor/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;