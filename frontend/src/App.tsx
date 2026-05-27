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
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function App() {
  const { tokenData, loginInProgress, logIn, error } = useContext(AuthContext);

  const [initialized, setInitialized] = useState(false);
  const isAdmin = tokenData?.realm_access?.roles?.includes("Admin");

  // useEffect(() => {
  //   if (!loginInProgress && !tokenData) {
  //     logIn();
  //   } else if (tokenData) {
  //     setInitialized(true);
  //   }
  // }, [loginInProgress, tokenData, logIn]);

useEffect(() => {
  console.log("🔥 App useEffect triggered");
  console.log("loginInProgress:", loginInProgress);
  console.log("tokenData:", tokenData);

  const isRedirectCallback =
    window.location.search.includes("code=");

  console.log("isRedirectCallback:", isRedirectCallback);
  console.log("URL:", window.location.href);

  if (isRedirectCallback) {
    console.log("🚨 Returning from Keycloak redirect - skipping login");
    return;
  }

  if (!loginInProgress && !tokenData) {
    console.log("➡️ No token found - calling logIn()");
    logIn();
  }

  if (tokenData) {
    console.log("✅ Token exists - initializing app");
    setInitialized(true);
  }
}, [loginInProgress, tokenData, logIn]);












  if (!initialized) {
    if (!initialized) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
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
