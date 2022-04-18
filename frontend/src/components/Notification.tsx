import React from "react";
import { useAppSelector } from "../reducers/hooks";
import { selectNotification } from "../reducers/notification";

export const Notification = () => {
  const message = useAppSelector(selectNotification);

  if (message === "") {
    return null;
  }

  return (
    <div className="notificationDiv">
      <p className="notification">{message}</p>
    </div>
  );

};  