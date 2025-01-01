import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { end, start } from "./loader.reducer";
import { callApi, decodeError } from "../../utility/utils/utils";
import { setError } from "./error.reducer";
const INITIAL_STATE = { orders: null, isLoading: false, error: null };

export const getInitialOrders = createAsyncThunk(
  "orders/getInitialOrders",
  async (_, thunkApi) => {
    try {
      thunkApi.dispatch(start());
      const options = {
        url: "http://localhost:4000/api/ecommerce/orders",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await callApi(options, 0);
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
export const ordersSlice = createSlice({
  name: "orders",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInitialOrders.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.orders = null;
      })
      .addCase(getInitialOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = [...action.payload];
      })
      .addCase(getInitialOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
        state.orders = null;
      });
  },
});

export const ordersReducer = ordersSlice.reducer;
export const ordersSelector = (state) => state.ordersReducer;
