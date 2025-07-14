import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddBirthday from "./pages/addBirthday";
import AllBirthday from "./pages/allBirthday";
import Keycloak from "./pages/keycloak";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllBirthday />} />
        <Route path="/addBirthday" element={<AddBirthday />} />
        <Route path="/keycloak" element={<Keycloak />} />
      </Routes>
    </Router>
  );
}

export default App;
