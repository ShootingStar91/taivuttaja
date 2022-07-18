import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import notificationReducer from './notification';
import { savingState } from './middleware';
import { ThunkMiddleware } from 'redux-thunk';
  
const reducers = combineReducers({user: userReducer, notification: notificationReducer});

export const store = configureStore(({ reducer: reducers, middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(savingState as ThunkMiddleware) } ));

export type RootState = ReturnType<typeof reducers>;

export type AppDispatch = typeof store.dispatch;

