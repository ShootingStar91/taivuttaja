import { AnyAction, Middleware } from "redux";
import { RootState } from "./store";


export const loadingState: Middleware<undefined, RootState> = storeApi => _next => _action => {
  const state = storeApi.getState();
  console.log("loaded state:", state);
};

export const savingState: Middleware<undefined, RootState> = storeApi => next => (action: AnyAction) => {
  next(action);
  if (!(action.type as string).startsWith('user/')) {
    return;
  }
  const state = storeApi.getState().user;
  console.log("user in savingState:", state.user);
};
