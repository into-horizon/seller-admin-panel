// import { createStore } from 'redux'
import * as thunk from "redux-thunk";
import {
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { applyMiddleware } from "redux";
import login from "./auth";
import category from "./category";
import products from "./product";
import address from "./address";
import orders from "./orders";
import finance from "./finance";
import bankAccount from "./bankAccount";
import withdrawals from "./withdrawal";
import dialog from "./dialog";
import toast from "./toast";
import notifications from "./notifications";
const initialState = {
  sidebarShow: true,
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case "set":
      return { ...state, ...rest };
    default:
      return state;
  }
};

const reducers = combineReducers({
  changeState,
  login,
  category,
  products,
  address,
  orders,
  finance,
  bankAccount,
  withdrawals,
  dialog,
  toast,
  notifications,
});

const store = configureStore(
  {
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  },
  applyMiddleware(thunk)
);
export default store;
