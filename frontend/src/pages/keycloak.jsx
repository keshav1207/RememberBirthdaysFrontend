import React, { useEffect, useState } from "react";
import { initKeycloak, getToken, doLogout } from "../services/KeycloakService";

function Keycloak() {
  const [initialized, setInitialized] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    initKeycloak(() => setInitialized(true));
  }, []);

  const callSecureApi = () => {
    fetch("http://localhost:8081/secure/hello", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.text())
      .then((data) => setMessage(data));
  };

  if (!initialized) return <div>Loading...</div>;

  return (
    <div>
      <h1>React + Keycloak + Spring Boot</h1>
      <button onClick={callSecureApi}>Call Secure API</button>
      <button onClick={doLogout}>Logout</button>
      <p>{message}</p>
    </div>
  );
}

export default Keycloak;
