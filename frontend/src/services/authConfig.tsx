interface RefreshTokenExpireEvent {
  logIn: () => void;
}

export const authConfig = {
  clientId: "RememberBirthdays-PKCE",
  authorizationEndpoint:
    "http://127.0.0.1:8080/realms/RememberBirthdays/protocol/openid-connect/auth",
  tokenEndpoint:
    "http://127.0.0.1:8080/realms/RememberBirthdays/protocol/openid-connect/token",
  redirectUri: "http://localhost:3000",
  scope: "openid profile email offline_access",
  onRefreshTokenExpire: (event: RefreshTokenExpireEvent) => event.logIn(),
};
