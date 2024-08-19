import { Fragment } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar bg-navbar">
      <h1>
        <Link className='logo-navbar' to="/">Schedule Manager</Link>
      </h1>
      <Fragment>
      <ul>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
      </Fragment>
    </nav>
  );
};

export default Navbar;