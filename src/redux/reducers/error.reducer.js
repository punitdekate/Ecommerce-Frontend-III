import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  message: null,
  code: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState: INITIAL_STATE,
  reducers: {
    setError: (state, action) => {
      state.message = action.payload.message;
      state.code = action.payload.code;
    },
    clearError: (state, action) => {
      state.message = null;
      state.code = null;
    },
  },
});

export const errorReducer = errorSlice.reducer;
export const { setError, clearError } = errorSlice.actions;
export const errorSelector = (state) => state.errorReducer;
