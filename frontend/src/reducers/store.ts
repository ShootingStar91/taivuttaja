import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import notificationReducer from './notification';

const store = configureStore(( { reducer: { user: userReducer, notification: notificationReducer } }));

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;