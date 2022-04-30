import React from "react";
import { useAppSelector } from "../reducers/hooks";
import { selectUser } from "../reducers/user";

export const InfoBar = () => {
  const user = useAppSelector(selectUser);

  if (!user?.goal) {
    return null;
  }
  const percentage = user.doneWordsToday / user.goal * 100;
  const goalInfo = () => {
    if (!user || !user.goal) return null;
    if (user.doneWordsToday < user.goal) {
      return (<><label htmlFor='progress'>Daily progress: {user.doneWordsToday} / {user.goal} </label>
      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: percentage}}></div>
      </div>
      </>);
    } else {
      return <>Daily goal of {user.goal} achieved!</>;
    }
  };

  return (
    <div className="bg-amber-100 container flex flex-wrap justify-center items-center gap-12 mx-auto p-1">
      <span>Logged in as <span className='text-amber-600 font-bold'>{user.username}</span></span>
      <span>{goalInfo()}</span>
    </div>
  );
};
