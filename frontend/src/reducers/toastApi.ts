import { ToastType } from "../types";
import { showToast } from "./notification";
import { store } from "./store";

export const errorToast = (message: string) => {
  void store.dispatch(showToast({ message, type: ToastType.ERROR }));
};

export const successToast = (message: string) => {
  void store.dispatch(showToast({ message, type: ToastType.SUCCESS }));
};

export const neutralToast = (message: string) => {
  void store.dispatch(showToast({ message, type: ToastType.NORMAL }));
};

export const clearToast = () => {
  void store.dispatch(showToast({ message: "", type: ToastType.NORMAL }));
};
