import MapEditor from "./pages/MapEditor";
import ShortestRoute from "./pages/ShortestRoute"
import EmergencyRoute from "./pages/EmergencyRoute";
import Welcome from "./pages/Welcome";

import { BrowserRouter, Routes, Route} from "react-router";
import LostAndFound from "./pages/LostAndFound";
import Lost from "./pages/Lost";
import Found from "./pages/Found";
import FoundForm from './pages/FoundForm'
import LostItem from "./pages/LostItem";
import LostItemNavigate from "./pages/LostItemNavigate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Welcome/>} />
        <Route path="find-route" element={<ShortestRoute/>} />
        <Route path="emergency-route" element={<EmergencyRoute/>} />
        <Route path="lost-and-found" element={<LostAndFound/>} />

        <Route path="lost">
          <Route index element={<Lost/>} />
          <Route path=":itemid">
            <Route index element={<LostItem/>} />
            <Route path="navigate" element={<LostItemNavigate/> } />
          </Route>
        </Route>
        <Route path="lost" element={<Lost/>} />

        <Route path="found">
          <Route index element={<Found/>} />
          <Route path="form" element={<FoundForm/>} />
        </Route>

        <Route path="editor" element={<MapEditor/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;