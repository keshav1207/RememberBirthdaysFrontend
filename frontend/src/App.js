import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AddBirthday from "./pages/addBirthday";
import AllBirthday from "./pages/allBirthday";
import UserInfo from "./pages/userInfo.jsx";
import Admin from "./pages/admin.jsx";
import { useContext, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

function App() {
  const { tokenData } = useContext(AuthContext);
  const isAdmin = tokenData?.realm_access?.roles?.includes("Admin");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllBirthday />} />
        <Route
          path="/addBirthday"
          element={tokenData ? <AddBirthday /> : <Navigate to="/" />}
        />
        <Route
          path="/userInfo"
          element={tokenData ? <UserInfo /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
