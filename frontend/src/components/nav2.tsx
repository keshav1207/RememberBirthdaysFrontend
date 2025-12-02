import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "react-oauth2-code-pkce";
import { useContext } from "react";

const Navbar = () => {
  const { tokenData, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = tokenData?.realm_access?.roles.includes("Admin");

  function handleLogOut() {
    logOut();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🎉 Remember Birthdays </Link>
      </div>
      <input type="checkbox" id="toggle-menu" />
      <label htmlFor="toggle-menu" className="menu-icon">
        &#9776;
      </label>
      <div className="navbar-links">
        {isAdmin ? "" : <Link to="/">All Birthdays</Link>}
        {isAdmin ? "" : <Link to="/addBirthday">Add Birthday</Link>}
        {isAdmin ? <Link to="/userInfo"> My Info</Link> : ""}
        {isAdmin ? <Link to="/admin"> Admin</Link> : ""}
        <Link to="/about">About</Link>
        <button onClick={() => handleLogOut()}>Log out</button>
      </div>
    </nav>
  );
};

export default Navbar;
