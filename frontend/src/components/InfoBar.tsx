import React from "react";
import { useAppSelector } from "../reducers/hooks";
import { selectUser } from "../reducers/user";

export const InfoBar = () => {
  const user = useAppSelector(selectUser);

  const goalInfo = () => {
    if (!user || !user.goal) return null;
    const percentage = user.doneWordsToday / user.goal * 100;

    if (user.doneWordsToday < user.goal) {
      return (<><label htmlFor='progress'>Daily progress: {user.doneWordsToday} / <span id='dailygoalmax'>{user.goal}</span> </label>
      <div className="w-full bg-gray-100 rounded-full dark:bg-gray-700">
        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: percentage}}></div>
      </div>
      </>);
    } else {
      return <>Daily goal of {user.goal} achieved!</>;
    }
  };
  if (!user) {
    return null;
  }
  return (
    <div className="bg-blue-200 container flex flex-wrap justify-center items-center gap-12 mx-auto p-1">
      <span>Logged in as <span className='text-blue-600 font-bold'>{user.username}</span></span>
      <span>{goalInfo()}</span>
    </div>
  );
};
