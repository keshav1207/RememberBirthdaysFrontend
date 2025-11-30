import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { authConfig } from "./services/authConfig";
import { AuthProvider } from "react-oauth2-code-pkce";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider authConfig={authConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
