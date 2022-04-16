import axios from "axios";
import { baseUrl } from "../utils";
import { User } from "../types";
import { getHeader } from "./util";
const url = baseUrl + 'user';

interface LoginResponse {
  token: string,
  user: User
}

const createUser = async (username: string, password: string) => {
  return await axios.post<User>(`${url}/create`, { username, password });
};

const tryLogin = async (username: string, password: string) => {

  try {
    const result = await axios.post<LoginResponse>(`${url}/login`, { username, password });
    if (result.data) {
      const user: User = {
        username: result.data.user.username,
        id: result.data.user.id,
        token: result.data.token
      };
      return user;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.error) {
        console.log("Error on login:");
        console.log(error.response.data.error);
      }
    }
  }
};

export const deleteUser = async (token: string) => {
  const result = await axios.post<User>(`${url}/deleteuser/`, {}, getHeader(token));
  return result;
};

export const checkLogin = () => {
  const user = window.localStorage.getItem('loggedUser');
  if (user) {
    return JSON.parse(user) as User;

  }
  return;
};

export const changePassword = async (password: string, token: string) => {
  try {
    const result = await axios.post<User>(`${url}/deleteuser/`, { password }, getHeader(token));
    return result;
  } catch (e) {
    return e;
  }
};

export default {
  tryLogin,
  checkLogin,
  createUser,
  deleteUser
};