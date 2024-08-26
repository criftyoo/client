import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateOpenForSwap, fetchIsOpenForSwap, logout } from "../../redux/modules/users";

const Navbar = () => {
  const dispatch = useDispatch();
  const [toggled, setToggled] = useState(false);
  const { user, isAuthenticated, isOpenForSwap: openForSwap } = useSelector((state) => state.users);

  useEffect(() => {
    // Fetch the initial isOpenForSwap status when the component mounts
    dispatch(fetchIsOpenForSwap());
  }, [dispatch]);

  useEffect(() => {
    // Synchronize the toggled state with the openForSwap value from the Redux store
    setToggled(openForSwap);
  }, [openForSwap]);

  const handleToggleClick = () => {
    const formData = { isOpenForSwap: !toggled };
    dispatch(updateOpenForSwap(formData));
    dispatch(fetchIsOpenForSwap());
    setToggled(!toggled);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar bg-navbar">
      <h1>
        <Link className="logo-navbar" to="/">
          Scheduler
        </Link>
      </h1>
      <Fragment>
        <ul>
          {isAuthenticated && user && user.role === 'employee' && (
            <>
              <div style={{ color: "orange" }}>Open For Swap ?</div>
              <button
                className={`toggle-btn ${toggled ? "toggled" : ""}`}
                onClick={handleToggleClick}
              >
                <div className="thumb"></div>
              </button>
            </>
          )}
          <li>
            {isAuthenticated ? (
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </Fragment>
    </nav>
  );
};

export default Navbar;