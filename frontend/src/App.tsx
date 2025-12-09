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
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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
      <>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
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
      </>
    </Router>
  );
}

export default App;
