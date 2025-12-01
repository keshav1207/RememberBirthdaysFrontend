import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AddBirthday from "./pages/addBirthday";
import AllBirthday from "./pages/allBirthday";
import UserInfo from "./pages/userInfo";
import Admin from "./pages/admin";

function App() {
  const { tokenData, loginInProgress, logIn, error } = useContext(AuthContext);

  const [initialized, setInitialized] = useState(false);
  const isAdmin = tokenData?.realm_access?.roles?.includes("Admin");

  useEffect(() => {
    if (!loginInProgress && !tokenData) {
      logIn();
    } else if (tokenData) {
      setInitialized(true);
    }
  }, [loginInProgress, tokenData, logIn]);

  if (!initialized) {
    return <div></div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAdmin ? <Admin /> : <Navigate to="/allBirthday" />}
        />
        <Route path="/allBirthday" element={<AllBirthday />} />
        <Route path="/addBirthday" element={<AddBirthday />} />
        <Route path="/userInfo" element={<UserInfo />} />

        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <Navigate to="/allBirthday" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
