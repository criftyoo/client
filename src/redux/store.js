import { applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./modules";


const initialState = {};

const store = configureStore(
  {
    reducer: rootReducer,
  },
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;