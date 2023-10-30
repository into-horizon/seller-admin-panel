import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Orders from "../services/Orders";
import { triggerToast } from "./toast";
import { DialogType } from "react-custom-popup";

const orders = createSlice({
  name: "orders",
  initialState: {
    pendingOrders: { orders: [], count: 0 },
    ordersOverview: { orders: [], count: 0 },
    messages: "",
    statuses: [],
    loading: false,
  },
  reducers: {
    addPendingOrders(state, action) {
      return { ...state, pendingOrders: action.payload };
    },
    errorMessage(state, action) {
      return { ...state, errorMessage: action.payload };
    },
    addOverviewOrders(state, action) {
      state.ordersOverview = action.payload;
    },
    addStatues(state, action) {
      return { ...state, statuses: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOverviewOrdersHandler.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getOverviewOrdersHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOverviewOrdersHandler.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const getPendingOrdersHandler = (payload) => async (dispatch, state) => {
  try {
    let response = await Orders.getStorePendingOrders(payload);
    dispatch(addPendingOrders(response));
  } catch (error) {
    dispatch(errorMessage(error.message));
  }
};
export const getOverviewOrdersHandler = createAsyncThunk(
  "order/get/overview",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { status, data, message } = await Orders.getStoreNotPendingOrders(
        payload
      );
      if (status === 200) {
        dispatch(addOverviewOrders(data));
      } else {
        rejectWithValue(message);
        dispatch(triggerToast({ message, type: DialogType.DANGER }));
      }
    } catch (error) {
      console.log("🚀 ~ file: orders.js:65 ~ error:", error)
      rejectWithValue(error.message);
      dispatch(
        triggerToast({ message: error.message, type: DialogType.DANGER })
      );
    }
  }
);

export const updateOrderItemHandler = (payload) => async (dispatch, state) => {
  try {
    let { status, result, message } = await Orders.updateOrderItem(payload);
    if (status === 200) {
      let newState = await state().orders.pendingOrders.orders.map((order) => {
        let items = order.items.map((item) => {
          if (item.id === result.id) return result;
          else return item;
        });
        return { ...order, items: items };
      });
      dispatch(
        addPendingOrders({ ...state().orders.pendingOrders, orders: newState })
      );
    } else {
      dispatch(errorMessage(message));
    }
  } catch (error) {
    dispatch(errorMessage(error.message));
  }
};

export const getStatuesHandler = () => async (dispatch) => {
  try {
    let { data, status } = await Orders.getStatues();
    if (status === 200) {
      dispatch(addStatues(data));
    }
  } catch (error) {
    dispatch(errorMessage(error.message));
  }
};

export default orders.reducer;
export const { addPendingOrders, errorMessage, addOverviewOrders, addStatues } =
  orders.actions;
