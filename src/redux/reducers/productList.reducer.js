import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { start, end } from "./loader.reducer.js";
import { setError } from "./error.reducer.js";

const INITIAL_STATE = {
  products: [],
  details: {},
  isLoading: false,
  error: null,
};

const decodeError = (error, defaultMessage = "") => {
  const message =
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    defaultMessage;
  const code = error.response.status || error.code || 400;
  return { message, code };
};

const callApi = async (options, retry = 0) => {
  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    if (error.status >= 500 && retry < 3) {
      callApi(options, ++retry);
    }
    throw error;
  }
};
// define and export productList async thunk below
export const getInitialState = createAsyncThunk(
  "productList/getInitialState",
  async (_, thunkApi) => {
    try {
      thunkApi.dispatch(start());
      const options = {
        url: "http://localhost:4000/api/ecommerce/products",
        method: "GET",
      };
      const response = await callApi(options, 0);
      return response.data.products;
    } catch (error) {
      const errorMessage = decodeError(error, "Failed to fetch products.");
      thunkApi.dispatch(setError(errorMessage));
      thunkApi.rejectWithValue({ error: errorMessage });
    } finally {
      thunkApi.dispatch(end());
    }
  }
);

export const getFilterState = createAsyncThunk(
  "productList/getFilterState",
  async (filter, thunkApi) => {
    try {
      //   highToLow: false,
      // lowToHigh: false,
      // category: null,
      thunkApi.dispatch(start());
      let url = `http://localhost:4000/api/ecommerce/products`;
      let filterUrl = "";

      if (filter.highToLow) {
        filterUrl = filterUrl + `sort=price&order=1`;
      } else if (filter.lowToHigh) {
        filterUrl = filterUrl + `sort=price&order=-1`;
      }

      if (filter.category?.trim()) {
        filterUrl =
          filterUrl + `${filterUrl ? "&" : ""}category=${filter.category}`;
      }

      if (filterUrl) {
        url = url + "?" + filterUrl;
      }
      const options = {
        url: url,
        method: "GET",
      };

      const response = await callApi(options, 0);
      return response.data.products;
    } catch (error) {
      const errorMessage = decodeError(error, "Failed to fetch products.");
      thunkApi.dispatch(setError(errorMessage));
      thunkApi.rejectWithValue({ error: errorMessage });
    } finally {
      thunkApi.dispatch(end());
    }
  }
);

export const addProduct = createAsyncThunk(
  "productList/addProduct",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(start());
      const options = {
        url: "http://localhost:4000/api/ecommerce/products",
        maxBodyLength: Infinity,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      const response = await callApi(options, 0);
      thunkApi.dispatch(
        setError({
          message: "Product has been successfully added to the website!",
          code: 200,
        })
      );
      thunkApi.dispatch(getInitialState());
    } catch (error) {
      const errorMessage = decodeError(error, "Failed to add product");
      thunkApi.dispatch(setError(errorMessage));
    } finally {
      thunkApi.dispatch(end());
    }
  }
);
export const deleteProduct = createAsyncThunk(
  "productList/remove",
  async (productId, thunkApi) => {
    try {
      thunkApi.dispatch(start());
      const options = {
        url: `http://localhost:4000/api/ecommerce/products/${productId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await callApi(options, 0);
      thunkApi.dispatch(
        setError({
          message: "Product removed successfully.",
          code: 200,
        })
      );
      /** Reload the product list for getting updated product list */
      thunkApi.dispatch(getInitialState());
    } catch (error) {
      const errorMessage = decodeError(error, "Failed to add product");
      thunkApi.dispatch(setError(errorMessage));
      thunkApi.rejectWithValue({ error: errorMessage });
    } finally {
      thunkApi.dispatch(end());
    }
  }
);

export const updateProduct = createAsyncThunk(
  "productList/updateProduct",
  async (data, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const user = state.userReducer.user;
      thunkApi.dispatch(start());
      const options = {
        url: `http://localhost:4000/api/ecommerce/products/${data.id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        data: data.data,
      };
      const response = await callApi(options, 0);
      thunkApi.dispatch(
        setError({
          message: "Product has been successfully updated to the website!",
          code: 200,
        })
      );
      thunkApi.dispatch(getInitialState());
    } catch (error) {
      const errorMessage = decodeError(error, "Failed to update product");
      thunkApi.dispatch(setError(errorMessage));
    } finally {
      thunkApi.dispatch(end());
    }
  }
);

export const getProduct = createAsyncThunk(
  "productList/getProduct",
  async (productId, thunkApi) => {
    try {
      thunkApi.dispatch(start());
      const options = {
        url: `http://localhost:4000/api/ecommerce/products/${productId}`,
        method: "GET",
      };
      console.log(options);
      const response = await callApi(options);
      console.log(response);
      return response.data.data;
    } catch (error) {
      const errorMessage = decodeError(error, "Failed to get product details");
      thunkApi.dispatch(setError(errorMessage));
      thunkApi.rejectWithValue({ error: errorMessage });
    } finally {
      thunkApi.dispatch(end());
    }
  }
);

// refactor to use the createSlice method
const productListSlice = createSlice({
  name: "productList",
  initialState: INITIAL_STATE,
  reducers: {
    fetchSuccess: (state, action) => {
      state.products = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInitialState.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInitialState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.products = [...action.payload];
      })
      .addCase(getInitialState.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.error || "Unknown error occurred.";
        state.products = [];
      })
      .addCase(getFilterState.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFilterState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.products = [...action.payload];
      })
      .addCase(getFilterState.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.error || "Unknown error occurred.";
        state.products = [];
      })
      .addCase(getProduct.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.details = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.error || "Unknown error occurred.";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.error || "Unknown error occurred.";
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      });
  },
});

// export the productList reducer function and action creators here
export const productListReducer = productListSlice.reducer;
export const { fetchSuccess } = productListSlice.actions;
export const productListSelector = (state) => state.productListReducer;
