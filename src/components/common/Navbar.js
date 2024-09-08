import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateOpenForSwap,
  fetchIsOpenForSwap,
  logout,
} from "../../redux/modules/usersSlice";
import socketIOClient from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import ClientReportForm from "../ReportIssues/ReportIssuesForm";

const ENDPOINT =
  "https://scheduler-server-a6deb2hrgug8evbw.westeurope-01.azurewebsites.net/"; // Update this to your server's base URL

const Navbar = () => {
  const dispatch = useDispatch();
  const [toggled, setToggled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to manage form visibility
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

  const toggleForm = () => {
    setShowForm(!showForm);
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
              <li>
                Report an issue{" "}
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  onClick={toggleForm}
                  className="report-icon"
                />
                {showForm && (
                  <div className="popup-form">
                    <ClientReportForm />
                  </div>
                )}
              </li>
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
                      <div className="notification-item">
                        No new notifications
                      </div>
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
                <button
                  className={`toggle-btn ${toggled ? "toggled" : ""}`}
                  onClick={handleToggleClick}
                >
                  <div className="thumb"></div>
                </button>
              </li>
              <li>
                <div style={{ color: "orange" }}>Open For Swap ?</div>
              </li>
            </>
          )}
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
