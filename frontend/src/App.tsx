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
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

function App() {
  const { tokenData, logIn } = useContext(AuthContext);
  const [redirecting, setRedirecting] = useState(true);
  const [loginStarted, setLoginStarted] = useState(false);
  const isAdmin = tokenData?.realm_access?.roles?.includes("Admin");

  useEffect(() => {
    if (!tokenData && !loginStarted) {
      setLoginStarted(true);
      logIn();
    } else if (tokenData) {
      setRedirecting(false);
    }
  }, [tokenData, logIn, loginStarted]);

  if (redirecting) {
    return <div>Loading...</div>;
  }
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
