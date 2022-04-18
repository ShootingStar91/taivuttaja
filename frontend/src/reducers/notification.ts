import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NOTIFICATION_DELAY } from "../config";
import { AppDispatch, RootState } from './store';

export interface NotificationState {
  message: string;
  id: number;
}

const initialState: NotificationState = {
  message: "",
  id: 0,
};

const delay = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
};

export const showNotification = createAsyncThunk<
  void, string, {
    dispatch: AppDispatch,
    state: RootState,
  }>
  (
    'notification/add',
    async (message: string, thunkAPI) => {
      thunkAPI.dispatch(setNotification(message));
      const state = thunkAPI.getState();
      const id = state.notification.id;
      await delay(NOTIFICATION_DELAY);
      const currentState = thunkAPI.getState();
      if (currentState.notification.id === id) {
        thunkAPI.dispatch(setNotification(""));
      }
    }
  );

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<string>) => {
      return { id: state.id + 1, message: action.payload };
    }
  }
});

export const { setNotification } = notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification.message;

export default notificationSlice.reducer;
