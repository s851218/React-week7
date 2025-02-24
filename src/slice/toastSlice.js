import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    pushMessage(state, action) {
      const { text, status } = action.payload;
      const id = Date.now();

      state.messages.push({
        id,
        text,
        status,
      });
    },
    removeMessage(state, action) {
      const message_id = action.payload;

      const index = state.messages.findIndex(
        (message) => message.id === message_id
      );

      if (index !== -1) {
        state.messages.splice(index, 1);
      }
    },
  },
});

export const { pushMessage, removeMessage } = toastSlice.actions;

export default toastSlice.reducer;
