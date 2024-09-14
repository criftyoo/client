import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Landing from "./components/common/Landing";
import Register from "./components/Users/Register";
import Login from "./components/Users/Login";
import Navbar from "./components/common/Navbar";
import Swapper from "./components/Employee/EmployeeDashboard";
import store from "./redux/store";
import { Provider } from "react-redux";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Alert from "./components/common/Alert";
import AdminDashboard from "./components/Admin/AdminDashboard";
import SwapRequestForm from "./components/Employee/SwapRequestForm";
import ErrorBoundary from "./components/common/ErrorBoundary";
import EmployeeDashboard from "./components/Employee/EmployeeDashboard";
import PrivateRouteWithPersist from "./components/common/PrivateRoute"; // Import updated PrivateRouteWithPersist
import Notification from "./components/common/Notification";
import { loadUser } from "./redux/modules/users"; // Import loadUser action

const options = {
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};

function Main() {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/login", "/register"];

  return (
    <>
      <Alert />
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Notification />
      <ErrorBoundary>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route
            exact
            path="/admin/*"
            element={
              <PrivateRouteWithPersist role="admin">
                <AdminDashboard />
              </PrivateRouteWithPersist>
            }
          />
          <Route
            exact
            path="/employee/*"
            element={
              <PrivateRouteWithPersist role="employee">
                <EmployeeDashboard />
              </PrivateRouteWithPersist>
            }
          />
          <Route
            exact
            path="/home"
            element={
              <PrivateRouteWithPersist>
                <Swapper />
              </PrivateRouteWithPersist>
            }
          />
          <Route
            exact
            path="/requester"
            element={
              <PrivateRouteWithPersist>
                <SwapRequestForm />
              </PrivateRouteWithPersist>
            }
          />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AlertProvider template={AlertTemplate} {...options}>
          <Main />
        </AlertProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;