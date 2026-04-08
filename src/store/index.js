import { configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "./slices/counter";
import { authReducer } from "./slices/auth";

const store = configureStore({
  reducer: { counter: counterReducer, auth: authReducer },
});

export default store;
