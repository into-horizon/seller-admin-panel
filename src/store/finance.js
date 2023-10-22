import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Finance from "../services/Finance";
import build from "enzyme";

const initialState = {
  loading: false,
  transactions: { data: [], count: 0 },
  message: "",
  pending: 0,
  refunded: 0,
  released: 0,
  transferred: 0,
  withdrawn: 0,
  canceledWithdrawn: 0,
};

const finance = createSlice({
  name: "finance",
  initialState,
  reducers: {
    addData(state, action) {
      return { ...state, ...action.payload };
    },
    errorMessage(state, action) {
      return { ...state, message: action.payload };
    },
    updateWithdrawn(state, action) {
      return { ...state, withdrawn: state.withdrawn + action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPendingAmounts.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getPendingAmounts.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(getPendingAmounts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTransactions.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getTransactions.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(getTransactions.pending, (state) => {
      state.loading = true;
    });
  },
});

export const getTransactions = createAsyncThunk(
  "finance/getTransactions",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { status, data, message, count } = await Finance.getTransactions(
        payload
      );
      if (status === 200) {
        dispatch(addData({ transactions: { data, count } }));
      } else {
        rejectWithValue(message);
        dispatch(errorMessage(message));
      }
    } catch (error) {
      rejectWithValue(error.message);
      dispatch(errorMessage(error.message));
    }
  }
);

export const getPendingAmounts = createAsyncThunk(
  "finance/getAmounts",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { status, data } = await Finance.getAmountsSummary();
      console.log("🚀 ~ file: finance.js:79 ~ data:", data);
      const getAmount = (type, status) => {
        return (
          data.find(
            (amount) => amount.type === type && amount.status === status
          )?.sum?.toFixed(2) ?? 0
        );
      };
      const pending = getAmount('credit','pending') - getAmount('credit','released') - getAmount('credit', 'canceled')
      const released = getAmount('credit', 'released') - getAmount('debit', 'transferred')
      const refunded = getAmount('debit', 'refunded') 
      // let { status: s1, amount: pending } = await Finance.pendingAmounts();
      // let { status: s2, amount: released } = await Finance.releasedAmounts();
      // let { status: s3, amount: refunded } = await Finance.refundedAmounts();
      // let { status: s4, amount: canceled } =
      //   await Finance.canceledWithdrawnAmount();
      // let { status: s5, amount: transferred } =
      //   await Finance.transferredAmount();
      // let { status: s6, amount: withdrawn } = await Finance.withdrawnAmount();
      if (
        status === 200 &&
      ) {
        dispatch(
          addData({
            pending: pending,
            released: released,
            refunded: refunded,
            transferred: transferred,
            canceledWithdrawn: canceled,
            withdrawn: withdrawn,
          })
        );
      }
    } catch (error) {
      rejectWithValue(error.message);
      dispatch(errorMessage(error.message));
    }
  }
);

export const { addData, errorMessage, updateWithdrawn } = finance.actions;

export default finance.reducer;
