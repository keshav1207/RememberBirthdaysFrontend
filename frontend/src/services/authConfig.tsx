interface RefreshTokenExpireEvent {
  logIn: () => void;
}

// Use environment variables or fallback defaults
const KEYCLOAK_BASE_URL = process.env.REACT_APP_KEYCLOAK_BASE_URL || "http://localhost:8080";
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || "http://localhost:3000";

export const authConfig = {
  clientId: "RememberBirthdays-PKCE",
  authorizationEndpoint: `${KEYCLOAK_BASE_URL}/realms/RememberBirthdays/protocol/openid-connect/auth`,
  tokenEndpoint: `${KEYCLOAK_BASE_URL}/realms/RememberBirthdays/protocol/openid-connect/token`,
  redirectUri: REDIRECT_URI,
  scope: "openid profile email offline_access",
  onRefreshTokenExpire: (event: RefreshTokenExpireEvent) => event.logIn(),
};
