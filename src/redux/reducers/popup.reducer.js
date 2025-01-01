import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  message: null,
  yes: null,
  no: null,
};

const popUpSlice = createSlice({
  name: "popup",
  initialState: INITIAL_STATE,
  reducers: {
    setYes: (state) => {
      state.yes = true;
      state.no = false;
    },
    setNo: (state) => {
      state.yes = false;
      state.no = true;
    },
  },
});

const popUpReducer = popUpSlice.reducer;
const { setYes, setNo } = popUpSlice.actions;
const popupSelector = (state) => state.popUpReducer;

export { popUpReducer, popupSelector, setNo, setYes };
