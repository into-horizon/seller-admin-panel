import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Address from "../services/Address";
import { triggerToast } from "./toast";
import { PopupType } from "react-custom-popup";

const address = createSlice({
  name: "address",
  initialState: {
    address: {},
    message: "",
    isAddressUpdating: false,
    isAddressLoading: false,
  },
  reducers: {
    addressState(state, action) {
      return { ...action.payload };
    },
    errorMessage(state, action) {
      return { ...state, message: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateAddress.fulfilled, (state) => {
      state.isAddressUpdating = false;
    });
    builder.addCase(updateAddress.pending, (state) => {
      state.isAddressUpdating = true;
    });
    builder.addCase(updateAddress.rejected, (state) => {
      state.isAddressUpdating = false;
    });
    builder.addCase(getAddress.fulfilled, (state) => { 
      state.isAddressLoading = false;
    });
    builder.addCase(getAddress.pending, (state) => {
      state.isAddressLoading = true;
    });
    builder.addCase(getAddress.rejected, (state) => {
      state.isAddressLoading = false;
    });
  },
});

export const addAddress = (payload) => async (dispatch, state) => {
  try {
    let { data, status, message } = await Address.addAddress(payload);
    if (status === 200) {
      dispatch(addressState({ address: data, message: message }));
    } else {
      dispatch(errorMessage({ data, status, message }));
    }
  } catch (error) {
    dispatch(errorMessage(error.message));
  }
};

export const getAddress = createAsyncThunk(
  "address/getAddress",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let { status, result, message } = await Address.getAddress();
      if (status === 200) {
        dispatch(addressState({ address: result }));
      } else {
        dispatch(triggerToast({ message, type: PopupType.DANGER }));
        return rejectWithValue(message);
      }
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: PopupType.DANGER })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data, status, message } = await Address.updateAddress(payload);
      if (status === 200) {
        dispatch(addressState({ address: data }));
        dispatch(triggerToast({ message, type: PopupType.SUCCESS }));
      } else {
        dispatch(triggerToast({ message, type: PopupType.DANGER }));
      }
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: PopupType.DANGER })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const removeAddress = (payload) => async (dispatch, state) => {
  console.log(
    "🚀 ~ file: address.js ~ line 56 ~ removeAddress ~ payload",
    payload
  );
  try {
    const { data, status, message } = await Address.deleteAddress(payload);
    if (status === 200) {
      dispatch(addressState({ address: {}, message: "deleted" }));
    } else {
      dispatch(errorMessage(message));
    }
  } catch (error) {
    dispatch(errorMessage(error.message));
  }
};

export default address.reducer;
export const { addressState, errorMessage } = address.actions;
