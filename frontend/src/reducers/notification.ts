import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NOTIFICATION_DELAY } from "../config";
import { RootState } from './store';

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
/*
export const clearAndShow = (message: string) => (dispatch: AppDispatch, getState: () => NotificationState ) => {
  console.log("called clearAndShow msg: " , message);
  dispatch(setNotification(message));
  const state = getState();
  const id = state.id;
  delay(NOTIFICATION_DELAY).then((_res) => {
    dispatch(clearNotification(id));
  }).catch(e => console.log(e));
};
*/

export const showNotification = createAsyncThunk(
  'notification/add',
  async (message: string, thunkAPI) => {
    const state = thunkAPI.getState() as NotificationState;
    thunkAPI.dispatch(setNotification(message));
    const id = state.id;
    await delay(NOTIFICATION_DELAY);
    const currentState = thunkAPI.getState() as NotificationState;
    if (currentState.id === id) {
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
