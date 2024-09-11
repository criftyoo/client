import { combineReducers } from "@reduxjs/toolkit";
import users from "./usersSlice";
import alerts from "./alertsSlice";
import admin from "./adminSlice";
import employee from "./employeeSlice";
import preferences from "./preferencesSlice";
import leaves from "./leavesSlice";
import news from "./newsSlice";
import reportIssues from "./reportIssuesSlice";
import swap from "./swapSlice";

const rootReducer = combineReducers({
  users,
  alerts,
  admin,
  employee,
  preferences,
  leaves,
  news,
  reportIssues,
  swap,
});

export default rootReducer;