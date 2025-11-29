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
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

function App() {
  const { tokenData, loading, logIn } = useContext(AuthContext);
  // This is used when loading becomes false (auth check is done) but tokenData is still null (because logIn() hasn't completed yet
  const [redirecting, setRedirecting] = useState(true);
  const isAdmin = tokenData?.realm_access?.roles?.includes("Admin");
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading) {
      if (!tokenData) {
        logIn();
      } else {
        setRedirecting(false);
      }
    }
  }, [loading, tokenData, logIn]);

  // Show loading while authentication is initializing
  if (loading || redirecting) {
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
