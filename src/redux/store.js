import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./modules";
import { setupListeners } from "@reduxjs/toolkit/query";

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Optional: Enable listener behavior for RTK Query
setupListeners(store.dispatch);

export default store;