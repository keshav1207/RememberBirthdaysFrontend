import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🎉 Birthday App</Link>
      </div>
      <input type="checkbox" id="toggle-menu" />
      <label htmlFor="toggle-menu" className="menu-icon">
        &#9776;
      </label>
      <div className="navbar-links">
        <Link to="/all-birthdays">All Birthdays</Link>
        <Link to="/add-birthday">Add Birthday</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
