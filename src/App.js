import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import Landing from "./components/Landing";
import store from "./redux/store";
import { Provider } from "react-redux";
import Register from "./components/Users/Register";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Alert from "./components/Alert";
import Login from "./components/Users/Login";
import Navbar from "./components/Navbar";

const options = {
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AlertProvider template={AlertTemplate} {...options}>
          <Fragment>
            <Alert />
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Landing />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/login" element={<Login />} />
              
            </Routes>
          </Fragment>
        </AlertProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
