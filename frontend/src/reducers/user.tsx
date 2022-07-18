import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { RootState } from './store';

interface UserState {
  user: User | undefined,
}

const initialState: UserState = {
  user: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return { ...state, user: action.payload };
    },
    removeUser: state => {
      state.user = undefined;
    },
    setGoal: (state, action: PayloadAction<number>) => {
      if (!state.user) {
        return;
      }
      const newUser = { ...state.user, goal: action.payload };
      return { ...state, user: newUser };
    },
    addDoneWord: (state) => {
      if (!state.user) { return; }
      return { ...state, user: {...state.user, doneWordsToday: state.user.doneWordsToday + 1}};
    }
  }
});

export const { setUser, removeUser, setGoal, addDoneWord } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
