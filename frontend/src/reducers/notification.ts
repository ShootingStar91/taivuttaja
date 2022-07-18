import { AppDispatch, RootState } from './store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NOTIFICATION_DELAY } from '../config';
import { delay } from '../services/util';
import { ToastType } from '../types';

export interface NotificationState {
  data: ToastData;
  id: number;
}

const initialState: NotificationState = {
  data: {
    message: '',
    type: ToastType.NORMAL,
  },
  id: 0,
};

type ToastData = {
  message: string;
  type?: ToastType;
};

export const showToast = createAsyncThunk<
  void, ToastData, {
    dispatch: AppDispatch,
    state: RootState,
  }>
  (
    'notification/add',
    async (data: ToastData, thunkAPI) => {
      thunkAPI.dispatch(setNotification(data));
      const state = thunkAPI.getState();
      const id = state.notification.id;
      await delay(NOTIFICATION_DELAY);
      const currentState = thunkAPI.getState();
      if (currentState.notification.id === id) {
        thunkAPI.dispatch(setNotification({ message: '', type: ToastType.NORMAL }));
      }
    }
  );

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<ToastData>) => {
      return { id: state.id + 1, data: action.payload };
    }
  }
});

export const { setNotification } = notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification.data;

export default notificationSlice.reducer;
