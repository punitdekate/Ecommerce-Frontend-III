import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setError } from "./error.reducer.js";
import { start, end } from "./loader.reducer.js";

// Initial state for user slice
const INITIAL_STATE = {
  isLoggedIn: false,
  user: null,
};

// Async thunk for user registration
export const userRegister = createAsyncThunk(
  "user/register",
  async (user, thunkApi) => {
    try {
      thunkApi.dispatch(start()); // Start loader

      const payload = { ...user, role: "customer" };

      const options = {
        url: `https://ecommerce-backend-updated.onrender.com/api/ecommerce/users`,
        method: "POST",
        data: payload,
      };
      const response = await axios(options);

      thunkApi.dispatch(
        setError({
          message: "User registered successfully.",
          code: response.status,
        })
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "This email is already exist.";
      thunkApi.dispatch(
        setError({
          message: errorMessage,
          code: error?.response?.status || 400,
        })
      );
    } finally {
      thunkApi.dispatch(end()); // Stop loader
    }
  }
);

// Async thunk for user login
export const userLogin = createAsyncThunk(
  "user/login",
  async (user, thunkApi) => {
    try {
      thunkApi.dispatch(start()); // Start loader
      const options = {
        url: `https://ecommerce-backend-updated.onrender.com/api/ecommerce/users/generateToken`,
        method: "POST",
        data: user,
      };
      const response = await axios(options);

      if (response.data.success) {
        const token = response.data.data.token;
        if (token) {
          localStorage.setItem("authToken", token);
          const decodedUser = jwtDecode(token);
          thunkApi.dispatch(
            setError({ message: "User logged in successfully.", code: 200 })
          );
          return {
            user: decodedUser,
            isLoggedIn: true,
          };
        } else {
          throw new Error("Token is missing in the response.");
        }
      } else {
        throw new Error("Login failed.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.msg || error?.message || "Invalid credentials.";
      thunkApi.dispatch(
        setError({
          message: errorMessage,
          code: error?.response?.status || 400,
        })
      );
      return thunkApi.rejectWithValue();
    } finally {
      thunkApi.dispatch(end()); // Stop loader
    }
  }
);

// User slice to manage user state
const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // User Login
      .addCase(userLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(userLogin.rejected, (state) => {
        state.user = null;
        state.isLoggedIn = false;
      })

      // User Register
      .addCase(userRegister.fulfilled, (state) => {
        // No user state update for register in this case
      })
      .addCase(userRegister.rejected, (state) => {
        // No user state update on register rejection
      });
  },
});

export const userReducer = userSlice.reducer;
export const { logout } = userSlice.actions;
export const userSelector = (state) => state.userReducer;
