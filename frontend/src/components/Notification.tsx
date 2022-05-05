import React from "react";
import { useAppDispatch, useAppSelector } from "../reducers/hooks";
import { selectNotification, showToast, toast } from "../reducers/notification";
import { ToastType } from "../types";

export const Notification = () => {
  const notification = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  if (notification.message === "") {
    return null;
  }

  const getIcon = (type: ToastType | undefined) => {
    if (!type) {
      return null;
    }
    if (type === ToastType.SUCCESS) {
      return <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
      </div>;
    } else if (type === ToastType.ERROR) {
      return <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </div>;
    }
    return null;
  };

  return (
    <div id="toast-default" className="fixed top-5 right-14 lg:right-20 2xl:right-96 flex items-center w-full max-w-xs p-4 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 z-50" role="alert" onClick={() => void dispatch(showToast(toast("")))}>
      {getIcon(notification.type)}
      <div className="ml-3 font-normal">{notification.message}</div>

    </div>
  );

};  
