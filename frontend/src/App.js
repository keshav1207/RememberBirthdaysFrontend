import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddBirthday from "./pages/addBirthday";
import AllBirthday from "./pages/allBirthday";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllBirthday />} />
        <Route path="/addBirthday" element={<AddBirthday />} />
      </Routes>
    </Router>
  );
}

export default App;
