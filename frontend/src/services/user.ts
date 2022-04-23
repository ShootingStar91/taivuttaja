import axios from "axios";
import { baseUrl } from "../utils";
import { User } from "../types";
import { getHeader } from "./util";
const url = baseUrl + 'user';


const createUser = async (username: string, password: string) => {
  return await axios.post<User>(`${url}/create`, { username, password });
};

const getReadyUser = async (user: User) => {
  if (!user.token) {
    throw new Error("Invalid token");
  }
  const response = await axios.get<Date[]>(`${url}/donewords/`, getHeader(user.token));
  if (!response) {
    throw new Error("Could not get donewords");
  }
  const doneWords = response.data.filter(date => date.getDate() === new Date().getDate()).length;
  const fullUser: User = {
    username: user.username,
    id: user.id,
    token: user.token,
    goal: user.goal,
    doneWords
  };
  return fullUser;
};

const tryLogin = async (username: string, password: string) => {

  const result = await axios.post<User>(`${url}/login/`, { username, password });
  if (result.data) {
    return await getReadyUser(result.data);
  }
  throw new Error("Could not login");
};

const deleteUser = async (token: string) => {
  const result = await axios.post<User>(`${url}/deleteuser/`, {}, getHeader(token));
  return result;
};

const checkLogin = () => {
  const user = window.localStorage.getItem('loggedUser');
  if (user) {
    return JSON.parse(user) as User;
  }
  return;
};

export const changePassword = async (password: string, token: string) => {
    const result = await axios.post<User>(`${url}/changepassword/`, { password }, getHeader(token));
    return result;
};

const relog = async (token: string) => {
  const result = await axios.post<User>(`${url}/relog/`, getHeader(token));
  return getReadyUser(result.data);
};

const setGoal = async (goal: number, token: string) => {
  const result = await axios.post(`${url}/goal/`, { goal }, getHeader(token));
  return result;
};

const addDoneWord = async (wordId: string, token: string) => {
  await axios.post(`${url}/doneword/`, { wordId }, getHeader(token));
};

const getDoneWords = async (token: string) => {
  const result = await axios.get(`${url}/doneword/`, getHeader(token));
  return result;
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
  relog
};