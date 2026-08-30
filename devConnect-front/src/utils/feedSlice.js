import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    removeUserFromFeed: (state, action) => {
      const userIdToRemove = action.payload;
      return state.filter((user) => user._id !== userIdToRemove);
    },
    addFeed: (state, action) => {
      return action.payload;
    },
    clearFeed: () => {
      return [];
    },
  },
});

export const { removeUserFromFeed, addFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
