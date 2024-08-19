import { combineReducers } from "redux";
import users from "./users";
import alerts from "./alerts";

export default combineReducers({
  users,
  alerts,
});


