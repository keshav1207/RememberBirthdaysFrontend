import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "rememberBirthdays-realm",
  clientId: "rememberBirthdays-frontend",
});

const initKeycloak = (onAuthenticatedCallback) => {
  keycloak
    .init({
      onLoad: "login-required",
      checkLoginIframe: false,
    })
    .then((authenticated) => {
      if (authenticated) {
        onAuthenticatedCallback();
      } else {
        window.location.reload();
      }
    });
};

const getToken = () => keycloak.token;
const doLogout = () => keycloak.logout();

export { initKeycloak, getToken, doLogout };
