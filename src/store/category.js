import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Category from "../services/CategoryService";
import { triggerToast } from "./toast";
import { DialogType } from "react-custom-popup";

const category = createSlice({
  name: "Category",
  initialState: {
    categories: [],
    parentCategories: [],
    childCategories: [],
    grandChildCategories: [],
    loading: false,
  },
  reducers: {
    getParentCategories(state, action) {
      return { ...state, parentCategories: action.payload.response };
    },
    getChildCategories(state, action) {
      return { ...state, childCategories: action.payload.response };
    },
    getGrandChildCategories(state, action) {
      return { ...state, grandChildCategories: action.payload.response };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      state.categories = payload;
      state.loading = false;
    });
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCategories.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await Category.getCategories();
      return data;
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: DialogType.DANGER })
      );
    }
  }
);

export const getParentCategoriesHandler = () => async (dispatch, state) => {
  try {
    let res = await Category.getAllParentCategoires();
    dispatch(getParentCategories(res));
  } catch (error) {
    console.error(error);
  }
};

export const getChildCategoriesHandler = () => async (dispatch, state) => {
  try {
    let res = await Category.getAllChildCategoires();
    dispatch(getChildCategories(res));
  } catch (error) {
    console.error(error);
  }
};

export const getGrandChildCategoriesHandler = () => async (dispatch, state) => {
  try {
    let res = await Category.getAllGrandChildCategoires();
    dispatch(getGrandChildCategories(res));
  } catch (error) {
    console.error(error);
  }
};

export default category.reducer;
export const {
  getParentCategories,
  getChildCategories,
  getGrandChildCategories,
} = category.actions;
