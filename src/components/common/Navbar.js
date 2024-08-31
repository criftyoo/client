import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateOpenForSwap,
  fetchIsOpenForSwap,
  logout,
} from "../../redux/modules/users";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4000"; // Update this to your server's base URL

const Navbar = () => {
  const dispatch = useDispatch();
  const [toggled, setToggled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    user,
    isAuthenticated,
    isOpenForSwap: openForSwap,
  } = useSelector((state) => state.users);

  useEffect(() => {
    // Fetch the initial isOpenForSwap status when the component mounts
    dispatch(fetchIsOpenForSwap());
  }, [dispatch]);

  useEffect(() => {
    // Synchronize the toggled state with the openForSwap value from the Redux store
    setToggled(openForSwap);
  }, [openForSwap]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("notification", (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleToggleClick = () => {
    const formData = { isOpenForSwap: !toggled };
    dispatch(updateOpenForSwap(formData));
    dispatch(fetchIsOpenForSwap());
    setToggled(!toggled);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
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
          {isAuthenticated && user && user.role === "employee" && (
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
          <li className="notifications">
            <div onClick={handleNotificationsClick}>
              <i className="fas fa-bell"></i>{" "}
              {notifications.length > 0 && (
                <span className="notification-count">
                  {notifications.length}
                </span>
              )}
            </div>
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length === 0 ? (
                  <div className="notification-item">No new notifications</div>
                ) : (
                  notifications.map((notification, index) => (
                    <div key={index} className="notification-item">
                      {notification.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </li>
          <li>
            {isAuthenticated ? (
              <Link to="/" onClick={handleLogout}>
                Logout{" "}
                <i
                  className="fas fa-sign-out-alt"
                  style={{ marginLeft: "8px" }}
                ></i>
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
