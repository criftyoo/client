import { combineReducers } from "redux";
import users from "./users";
import alerts from "./alerts";
import admin from "./admin";
import employee from "./employee";

export default combineReducers({
  users,
  alerts,
  admin,
  employee,
});


