import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Product from "../services/ProductService";
import { triggerToast } from "./toast";
import { DialogType } from "react-custom-popup";

const initialState = {
  loading: false,
  message: "",
  product: [],
  currentProducts: { count: 0, products: [], searchData: [], searched: {} },
};

const products = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct(state, action) {
      return {
        ...state,
        message: action.payload.message,
        products: [...state.product, action.payload.result],
      };
    },
    errorMessage(state, action) {
      return { ...state, message: action.payload.message };
    },
    getProducts(state, action) {
      state.currentProducts.products = action.payload.result;
      state.currentProducts.count = action.payload.count;
    },
    addProductPicture(state, action) {
      return {
        ...state,
        message: action.payload.message,
        currentProducts: {
          ...state.currentProducts,
          products: action.payload.result,
        },
      };
    },
    deleteProductPicture(state, action) {
      return {
        ...state,
        message: action.payload.message,
        currentProducts: {
          ...state.currentProducts,
          products: action.payload.result,
        },
      };
    },
    updateProduct(state, action) {
      return {
        ...state,
        message: action.payload.message,
        currentProducts: {
          ...state.currentProducts,
          products: action.payload.result,
        },
      };
    },
    addSearchData(state, action) {
      return {
        ...state,
        message: action.payload.message,
        currentProducts: {
          ...state.currentProducts,
          searchData: action.payload.result,
        },
      };
    },
    addSearchedProduct(state, action) {
      return {
        ...state,
        message: action.payload.message,
        currentProducts: {
          ...state.currentProducts,
          searched: action.payload.result,
        },
      };
    },
    deleteProduct(state, action) {
      return {
        ...state,
        message: action.payload.message,
        currentProducts: {
          ...state.currentProducts,
          products: action.payload.result,
          count: action.payload.count,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductsByStatusHandler.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getProductsByStatusHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductsByStatusHandler.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const addProductHandler = (payload) => async (dispatch, state) => {
  try {
    let result = await Product.addProduct(payload);
    if (result.status === 201) {
      dispatch(addProduct(result));
    } else {
      dispatch(errorMessage({ message: result }));
    }
  } catch (error) {
    dispatch(
      errorMessage(() => {
        return { message: "something went wrong" };
      })
    );
  }
};

export const getProductsByStatusHandler = createAsyncThunk(
  "products/getByStatus",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { status, result, message, count } =
        await Product.getProductsByStatus(payload);
      if (status === 200) {
        dispatch(getProducts({ result, count }));
      } else {
        dispatch(triggerToast({ message, type: DialogType.DANGER }));
        rejectWithValue(message);
      }
    } catch (error) {
      rejectWithValue(error.message);
      dispatch(
        triggerToast({ message: error.message, type: DialogType.DANGER })
      );
    }
  }
);

export const addProductPictureHandler =
  (payload) => async (dispatch, state) => {
    try {
      let result = await Product.addProductPicture(payload);
      let x = state().products;
      if (result.status === 200) {
        let y = { ...x };
        let newState = y.currentProducts.products.map((product) => {
          if (result.data.product_id === product.id) {
            let newProduct = { ...product };
            let newPic = {
              id: result.data.id,
              product_picture: result.data.product_picture,
            };
            newProduct["pictures"] = [...product.pictures, newPic];
            return newProduct;
          } else return product;
        });
        dispatch(addProductPicture({ message: "success", result: newState }));
      } else {
        dispatch(errorMessage({ message: result }));
      }
    } catch (error) {
      dispatch(
        errorMessage(() => {
          return { message: "something went wrong" };
        })
      );
    }
  };
export const deleteProductPictureHandler =
  (payload) => async (dispatch, state) => {
    try {
      let { status, message } = await Product.deleteProductPicture(payload);
      let x = state().products;
      if (status === 200) {
        let y = { ...x };
        let newState = y.currentProducts.products.map((product) => {
          let newProduct = { ...product };
          let newPics = product.pictures.filter(
            (picture) => picture.id !== payload.picture_id
          );
          newProduct["pictures"] = newPics;
          return newProduct;
        });
        dispatch(
          deleteProductPicture({ message: "success", result: newState })
        );
      } else {
        dispatch(errorMessage({ message: message }));
      }
    } catch (error) {
      dispatch(
        errorMessage(() => {
          return { message: error.message };
        })
      );
    }
  };
export const updateSizeAndQuantity = (payload) => async (dispatch, state) => {
  try {
    let { result, message, status } = await Product.updateSizeAndQuantity(
      payload
    );
    if (status === 200) {
      let newProducts = [...state().products.currentProducts.products].map(
        (val) => {
          if (val.id === result.id) {
            return { ...val, ...result };
          } else return val;
        }
      );
      dispatch(updateProduct({ result: [...newProducts], message: "updated" }));
    } else {
      dispatch(errorMessage({ message: { result, message, status } }));
    }
  } catch (error) {
    dispatch(
      errorMessage(() => {
        return { message: error.message };
      })
    );
  }
};

export const updateDiscount = (payload) => async (dispatch, state) => {
  try {
    let { result, message, status } = await Product.updateDiscount(payload);
    if (status === 200) {
      let newProducts = [...state().products.currentProducts.products].map(
        (val) => {
          if (val.id === result.id) {
            let product = { ...val };
            product["discount"] = result.discount;
            product["discount_rate"] = result.discount_rate;

            return product;
          } else return val;
        }
      );
      dispatch(updateProduct({ result: [...newProducts], message: "updated" }));
    } else {
      dispatch(errorMessage({ message: { result, message, status } }));
    }
  } catch (error) {
    dispatch(
      errorMessage(() => {
        return { message: error.message };
      })
    );
  }
};
export const getSearchDataHandler = (payload) => async (dispatch, state) => {
  try {
    let { data, status } = await Product.getSearchData(payload);
    if (status === 200) {
      dispatch(addSearchData({ message: "searchData", result: data }));
    } else {
      dispatch(errorMessage({ message: { data, status } }));
    }
  } catch (error) {
    dispatch(
      errorMessage(() => {
        return { message: error.message };
      })
    );
  }
};

export const getSearchedProductHandler =
  (payload) => async (dispatch, state) => {
    try {
      let { status, data: product } = await Product.getProduct(payload);

      if (product.id) {
        dispatch(
          addSearchedProduct({ message: "searchedProduct", result: product })
        );
      } else {
        dispatch(errorMessage({ message: product }));
      }
    } catch (error) {
      dispatch(
        errorMessage(() => {
          return { message: error.message };
        })
      );
    }
  };

export const updateProductHandler = (payload) => async (dispatch, state) => {
  try {
    let { message, result, status } = await Product.updateProduct(payload);
    if (status === 200) {
      dispatch(addSearchedProduct({ message: "product updated", result: {} }));
    } else {
      dispatch(errorMessage({ message: { message, result, status } }));
    }
  } catch (error) {
    dispatch(
      errorMessage(() => {
        return { message: error.message };
      })
    );
  }
};

export const deleteProductHandler = (payload) => async (dispatch, state) => {
  try {
    let { message, status, data } = await Product.deleteProduct(payload);
    if (status === 200) {
      let results = state().products.currentProducts.products.filter(
        (product) => product.id !== payload
      );
      dispatch(
        deleteProduct({
          message: res,
          result: results,
          count: state().products.currentProducts.count - 1,
        })
      );
    }
  } catch (error) {
    dispatch(
      errorMessage(() => {
        return { message: error.message };
      })
    );
  }
};
export default products.reducer;
export const {
  addProduct,
  errorMessage,
  getProducts,
  addProductPicture,
  deleteProductPicture,
  updateProduct,
  addSearchData,
  addSearchedProduct,
  deleteProduct,
} = products.actions;
