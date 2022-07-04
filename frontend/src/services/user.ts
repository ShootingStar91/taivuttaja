/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { baseUrl } from "../config";
import { DoneWord, User } from "../types";
import { getHeader, success, error, customError } from "./util";
const url = baseUrl + 'user';

const createUser = async (username: string, password: string) => {
  try {
    const result = await axios.post<boolean>(`${url}/create`, { username, password });
    return success<boolean>(result.data);
  } catch (e: any) {
    return error(e);
  }
};

const getReadyUser = async (user: User) => {
  if (!user.token) {
    return customError("Invalid token");
  }
    const [err, result] = await getDoneWords(user.token);    
    if (!result) {
      return error(err);
    }
    const doneWords = result;
    const doneWordsToday = result.filter(dw => new Date(dw.date).getDate() === new Date().getDate()).length;
    const fullUser: User = {
      ...user,
      doneWords,
      doneWordsToday,
    };
    
    return success<User>(fullUser);
};

const tryLogin = async (username: string, password: string) => {
  try {
    const result = await axios.post<User>(`${url}/login/`, { username, password });
    
    if (result.data) {
      return getReadyUser(result.data);
    } else {
      return customError("Unknown error when trying to log in");
    }
  } catch (e: any) {
    return error(e);
  }
};

const deleteUser = async (token: string) => {
  try {
    const result = await axios.post<User>(`${url}/deleteuser/`, {}, getHeader(token));
    return success<User>(result.data);
  } catch (e) {
    return error(e);
  }
};

const checkLogin = () => {
  const user = window.localStorage.getItem('loggedUser');
  if (user) {
    return JSON.parse(user) as User;
  }
};

const changePassword = async (currentPassword: string, newPassword: string, token: string): Promise<[string, undefined | boolean]> => {
  try {
    const result = await axios.post<boolean>(`${url}/changepassword/`, { currentPassword, newPassword }, getHeader(token));
    return success<boolean>(result.data);
  } catch (e) {
    return error(e);
  }
};

const setGoal = async (goal: number, token: string) => {
  try {
    const result = await axios.post<User>(`${url}/goal/`, { goal }, getHeader(token));
    return success<User>(result.data);
  } catch (e: any) {
    return error(e);
  }
};

const addDoneWord = async (wordId: string, token: string) => {
  try {
    await axios.post(`${url}/doneword/`, { wordId }, getHeader(token));
    return success<boolean>(true);
  } catch (e: any) {
    return error(e);
  }
};

const getDoneWords = async (token: string) => {
  try {
    const result = await axios.get<DoneWord[]>(`${url}/donewords/`, getHeader(token));
    return success<DoneWord[]>(result.data);
  } catch (e: any) {
    return error(e);
  }
};

const setStrictAccents = async (strictAccents: boolean, token: string) => {
  try {
    const result = await axios.post<User>(`${url}/setstrictaccents/`, { strictAccents }, getHeader(token));
    return success<User>(result.data);
  } catch (e: any) {
    return error(e);
  }
};

export default {
  tryLogin,
  checkLogin,
  createUser,
  deleteUser,
  setGoal,
  addDoneWord,
  getDoneWords,
  changePassword,
  setStrictAccents
};