import React, { FormEvent, useState } from "react";
import { ERRORS } from "../../config";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { errorToast, successToast } from "../../reducers/toastApi";
import { selectUser, setGoal, setUser } from "../../reducers/user";
import userService from "../../services/user";

export const DailyGoalSetting = () => {
  const [dailyGoal, setDailyGoal] = useState<string>("50");

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const onSetDailyGoal = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.token) {
      errorToast(ERRORS.INVALID_LOGIN);
      return;
    }
    const result = await userService.setGoal(parseInt(dailyGoal), user.token);
    dispatch(setGoal(parseInt(dailyGoal)));
    if (result) {
      successToast("Daily goal set!");
    }
  };

  const changeDailyGoal = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newDailyGoal = event.currentTarget.value;
    if (newDailyGoal) {
      setDailyGoal(newDailyGoal);
    }
  };

  return (
    <>
      <h3>Daily goal</h3>
      <div className="flex gap-2">
        <p>
          <input
            className="bg-menu-color accent-menu-color"
            id="dailygoalslider"
            type="range"
            min="5"
            max="100"
            step="5"
            onChange={changeDailyGoal}
          ></input>{" "}
          <span className="font-bold">{dailyGoal}</span>
        </p>
        <p>
          <button
            id="setdailygoal"
            className="userpagebtn"
            type="button"
            onClick={onSetDailyGoal}
          >
            Save
          </button>
        </p>
      </div>
    </>
  );
};

export const StrictAccentSetting = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [strictAccents, setStrictAccents] = useState<boolean | undefined>(
    user?.strictAccents
  );

  const changeStrictAccents = async () => {
    if (!user || !user.token) {
      return;
    }
    const newStrictAccents = !strictAccents;
    setStrictAccents(!strictAccents);
    const [error, result] = await userService.setStrictAccents(
      newStrictAccents,
      user.token
    );
    if (!result) {
      errorToast(error);
    }
    dispatch(setUser({ ...user, strictAccents: newStrictAccents }));
  };

  return (
    <>
      <h3 className="mb-4">Strict accents mode</h3>
      <label
        htmlFor="strictaccentmode"
        className="relative inline-flex items-center mb-4 cursor-pointer"
      >
        <input
          id="strictaccentmode"
          type="checkbox"
          value=""
          className="sr-only peer"
          onChange={changeStrictAccents}
          checked={strictAccents}
        />

        {/* This toggle is from Flowbite at https://flowbite.com/docs/forms/toggle/ */}
        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-menu-color"></div>
        <span
          id="strictaccentonoff"
          className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {strictAccents ? "On" : "Off"}
        </span>
      </label>
      <div className="description">
        {
          "If this is on, the app will require 100% correct accents. For example, 'correis' will not be accepted for the word 'corréis'."
        }
      </div>
    </>
  );
};
