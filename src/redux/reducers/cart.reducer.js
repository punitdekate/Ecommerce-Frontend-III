import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { end, start } from "./loader.reducer";
import axios from "axios";
import { setError } from "./error.reducer";

// Initial state for the cart
const INITIAL_STATE = { cart: [], isLoading: false, error: null };

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

export const getInitialCart = createAsyncThunk(
  "cart/getInitialCart",
  async (_, thunkApi) => {
    try {
      // /api/ecommerce/users/:userId/cart
      thunkApi.dispatch(start());

      const options = {
        url: `https://ecommerce-backend-updated.onrender.com/api/ecommerce/cart`,
        maxBodyLength: Infinity,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      const response = await callApi(options);
      console.log(response);
      const cartItems =
        Object.keys(response.data).length !== 0
          ? response.data.products.map((ele) => {
              return { ...ele.productId, quantity: ele.quantity };
            })
          : [];
      console.log(cartItems);
      return { cart: cartItems };
    } catch (error) {
      const errorMessage = decodeError(error, "Failed to fetch cart.");
      thunkApi.dispatch(
        setError({ message: errorMessage.message, code: errorMessage.code })
      );
    } finally {
      thunkApi.dispatch(end());
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productId, thunkApi) => {
    try {
      thunkApi.dispatch(start());
      const options = {
        url: `https://ecommerce-backend-updated.onrender.com/api/ecommerce/cart/${productId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await callApi(options);
      thunkApi.dispatch(getInitialCart());
      thunkApi.dispatch(
        setError({
          message: "Product added to cart",
          code: 200,
        })
      );
    } catch (error) {
      console.log(error);
      const errorMessage = decodeError(
        error,
        "Failed to add product into cart."
      );
      console.log(errorMessage);

      if (errorMessage.message?.includes("jwt")) {
        errorMessage = "Please log in to continue.";
      }
      thunkApi.dispatch(setError(errorMessage));
    } finally {
      thunkApi.dispatch(end()); // Stop loader
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, thunkApi) => {
    try {
      thunkApi.dispatch(start());
      const options = {
        url: `https://ecommerce-backend-updated.onrender.com/api/ecommerce/cart/${productId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await callApi(options);
      thunkApi.dispatch(getInitialCart());
      thunkApi.dispatch(
        setError({
          message: "Product removed from cart",
          code: 200,
        })
      );
    } catch (error) {
      const errorMessage = decodeError(
        error,
        "Failed to remove product from cart."
      );
      if (errorMessage?.message?.includes("jwt")) {
        errorMessage = "Please log in to continue.";
      }
      thunkApi.dispatch(setError(errorMessage));
    } finally {
      thunkApi.dispatch(end()); // Stop loader
    }
  }
);

export const opCart = createAsyncThunk(
  "cart/opCart",
  async (data, thunkApi) => {
    try {
      thunkApi.dispatch(start());
      const options = {
        url: `https://ecommerce-backend-updated.onrender.com/api/ecommerce/cart/${data.productId}?op=${data.op}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await callApi(options);
      thunkApi.dispatch(getInitialCart());
    } catch (error) {
      const errorMessage = decodeError(
        error,
        "Failed to perform operation on product item in cart."
      );
      if (errorMessage?.message?.includes("jwt")) {
        errorMessage = "Please log in to continue.";
      }
      thunkApi.dispatch(
        setError({ message: errorMessage.message, code: errorMessage.code })
      );
    } finally {
      thunkApi.dispatch(end()); // Stop loader
    }
  }
);

// Cart slice
export const cartSlice = createSlice({
  name: "cart",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add to Cart Thunk
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {})
      // Get Initial Cart Thunk
      .addCase(getInitialCart.pending, (state, action) => {})
      .addCase(getInitialCart.fulfilled, (state, action) => {
        state.cart = [...action.payload.cart];
      })
      .addCase(getInitialCart.rejected, (state, action) => {})
      // Remove from Cart Thunk
      // .addCase(removeFromCartThunk.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(removeFromCartThunk.fulfilled, (state, action) => {
      //   state.cart = [...action.payload];
      //   state.isLoading = false;
      //   state.error = null;
      // })
      // .addCase(removeFromCartThunk.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload;
      // })
      //inc and dec cart item
      .addCase(opCart.pending, (state) => {})
      .addCase(opCart.fulfilled, (state, action) => {})
      .addCase(opCart.rejected, (state, action) => {});
  },
});

// Reducer export
export const cartReducer = cartSlice.reducer;

// Action creators export
export const { inc, dec, reset } = cartSlice.actions;

// Selector export
export const cartSelector = (state) => state.cartReducer;
