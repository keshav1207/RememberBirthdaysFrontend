interface RefreshTokenExpireEvent {
  logIn: () => void;
}

// Use environment variables or fallback defaults
const KEYCLOAK_BASE_URL = process.env.REACT_APP_KEYCLOAK_BASE_URL || "http://localhost:8080";
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || "http://localhost:3000";
const KEYCLOAK_REALM =process.env.REACT_APP_KEYCLOAK_REALM || "RememberBirthdays";

export const authConfig = {
  clientId:  process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "RememberBirthdays-PKCE",
  authorizationEndpoint: `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`,
  tokenEndpoint: `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
  redirectUri: REDIRECT_URI,
  scope: "openid profile email offline_access",
  onRefreshTokenExpire: (event: RefreshTokenExpireEvent) => event.logIn(),
};
