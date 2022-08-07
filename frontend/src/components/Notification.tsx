import React from "react";
import { useAppSelector } from "../reducers/hooks";
import { selectNotification } from "../reducers/notification";
import { clearToast } from "../reducers/toastApi";
import { ToastType } from "../types";

export const Notification = () => {
  const notification = useAppSelector(selectNotification);
  if (notification.message === "") {
    return null;
  }

  const getColor = (type: ToastType | undefined) => {
    if (type === ToastType.SUCCESS) {
      return "bg-green-50";
    } else if (type === ToastType.ERROR) {
      return "bg-rose-200";
    }
    return "bg-grey-50";
  };

  return (
    <div
      id="toast-default"
      className={
        "fixed top-[5%] right-[5%] flex items-center w-full max-w-xs p-4 rounded-sm shadow z-50" +
        " " +
        getColor(notification.type)
      }
      role="alert"
      onClick={() => clearToast()}
    >
      <div className="ml-3 font-normal">{notification.message}</div>
    </div>
  );
};
