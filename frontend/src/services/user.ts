import axios from "./index";
import { baseUrl } from "../config";
import { DoneWord, User } from "../types";
import { getHeader } from "./util";
const url = baseUrl + "user";

const createUser = async (username: string, password: string) => {
  const result = await axios.post<boolean>(`${url}/create`, {
    username,
    password,
  });
  return result && result.data;
};

const getReadyUser = async (user: User) => {
  /* If user.token missing here, will result in no error toast.
     Should not happen, this would be servers fault. Just throw an error */
  if (!user.token)
    throw new Error(
      "Fatal error: server returned invalid user.token on login."
    );
  const result = await getDoneWords(user.token);
  if (!result) {
    return;
  }
  const doneWords = result;
  const doneWordsToday = result.filter(
    (dw) => new Date(dw.date).getDate() === new Date().getDate()
  ).length;
  const fullUser: User = {
    ...user,
    doneWords,
    doneWordsToday,
  };

  return fullUser;
};

const tryLogin = async (username: string, password: string) => {
  const result = await axios.post<User>(`${url}/login/`, {
    username,
    password,
  });
  if (result && result.data) {
    return getReadyUser(result.data);
  }
};

const deleteUser = async (token: string) => {
  const result = await axios.post<boolean>(
    `${url}/deleteuser/`,
    {},
    getHeader(token)
  );
  return result.data;
};

const checkLogin = () => {
  const user = window.localStorage.getItem("loggedUser");
  if (user && user !== "undefined") {
    return JSON.parse(user) as User;
  }
};

const changePassword = async (
  currentPassword: string,
  newPassword: string,
  token: string
) => {
  const result = await axios.post<boolean>(
    `${url}/changepassword/`,
    { currentPassword, newPassword },
    getHeader(token)
  );
  return result.data;
};

const setGoal = async (goal: number, token: string) => {
  const result = await axios.post<boolean>(
    `${url}/goal/`,
    { goal },
    getHeader(token)
  );
  return result.data;
};

const addDoneWord = async (wordId: string, token: string) => {
  const result = await axios.post<boolean>(
    `${url}/doneword/`,
    { wordId },
    getHeader(token)
  );
  return result.data;
};

const getDoneWords = async (token: string) => {
  const result = await axios.get<DoneWord[]>(
    `${url}/donewords/`,
    getHeader(token)
  );
  return result && result.data;
};

const setStrictAccents = async (strictAccents: boolean, token: string) => {
  const result = await axios.post<boolean>(
    `${url}/setstrictaccents/`,
    { strictAccents },
    getHeader(token)
  );
  return result.data;
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
  setStrictAccents,
};
