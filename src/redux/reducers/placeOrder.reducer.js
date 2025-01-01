import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { callApi, decodeError } from "../../utility/utils/utils";
import { setError } from "./error.reducer";
import { end, start } from "./loader.reducer";
import { getInitialCart } from "./cart.reducer";
const INITIAL_STATE = { order: null, isLoading: false, error: null };

export const placeOrderThunk = createAsyncThunk(
  "placeOrder/placed",
  async (_, thunkApi) => {
    try {
      thunkApi.dispatch(start());
      const options = {
        url: "http://localhost:4000/api/ecommerce/orders",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await callApi(options, 0);
      thunkApi.dispatch(getInitialCart());
      thunkApi.dispatch(
        setError({ message: "Order placed successfully.", code: 200 })
      );
      return response.data;
    } catch (error) {
      const errorMessage = decodeError(error, "Failed to get orders");
      thunkApi.dispatch(setError(errorMessage));
      thunkApi.rejectWithValue({ error: errorMessage });
    } finally {
      thunkApi.dispatch(end());
    }
  }
);
const placeOrderSlice = createSlice({
  name: "placeOrder",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderThunk.pending, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.order = null;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.order = action.payload;
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error || "failed to place order.";
        state.order = null;
      });
  },
});

export const placeOrderReducer = placeOrderSlice.reducer;
export const placeOrderSelector = (state) => state.placeOrderReducer;
