import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddBirthday from "./pages/addBirthday";
import AllBirthday from "./pages/allBirthday";
import UserInfo from "./pages/userInfo.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllBirthday />} />
        <Route path="/addBirthday" element={<AddBirthday />} />
        <Route path="/userInfo" element={<UserInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
