import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from './store';

interface NotificationState {
  message: string;
}

const initialState: NotificationState = {
  message: ""
};


export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<string>) => {
      return { message: action.payload };
    },
    clearNotification: (state) => {
      console.log("in reducer clear notification");
      
      return { ...state, message: "" };

    }
  }
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification.message;

export default notificationSlice.reducer;
