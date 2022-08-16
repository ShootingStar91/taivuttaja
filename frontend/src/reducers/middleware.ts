import { AnyAction, Middleware } from "redux";
import { RootState } from "./store";

export const savingState: Middleware<undefined, RootState> =
  (storeApi) => (next) => (action: AnyAction) => {
    next(action);
    if (!(action.type as string).startsWith("user/")) {
      return;
    }
    const state = storeApi.getState().user;
    if (state.user) {
      window.localStorage.setItem("loggedUser", JSON.stringify(state.user));
    }
  };
