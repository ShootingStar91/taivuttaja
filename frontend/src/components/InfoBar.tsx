import React from "react";
import { useAppSelector } from "../reducers/hooks";
import { selectUser } from "../reducers/user";

export const InfoBar = () => {
  const user = useAppSelector(selectUser);

  if (!user) {
    return null;
  }

  const goalInfo = () => {
    if (!user || !user.goal) return null;
    if (user.doneWords < user.goal) {
      return (<><label htmlFor='progress'>Daily progress: {user.doneWords} / {user.goal} </label>
        <progress id='progress' value={user.doneWords.toString()} max={user.goal}></progress>

        </>);
    } else {
      return <>Daily goal of {user.goal} achieved!</>;
    }
  };

  return <div className="infoBar">Logged in as {user.username}. {goalInfo()} </div>;
};
