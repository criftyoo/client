import { combineReducers } from "redux";
import users from "./users";
import alerts from "./alerts";
import admin from "./admin";
import employee from "./employee";
import preferences from "./preferences";

export default combineReducers({
  users,
  alerts,
  admin,
  employee,
  preferences,
});


