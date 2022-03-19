import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from '../types';
import { RootState } from './store';

interface UserState {
  user: User | undefined
}

const initialState: UserState = {
  user: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return {...state, user: action.payload};
    },
    removeUser: state => {
      state.user = undefined;
      window.localStorage.clear();
    }
  }
});

export const { setUser, removeUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;