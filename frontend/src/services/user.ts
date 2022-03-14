import axios from "axios";
import { baseUrl } from "../utils";
import { User } from "../types";
const url = baseUrl + 'user';

interface LoginResponse {
  token: string,
  user: User
}

const tryLogin = async (username: string, password: string) => {


  try {
    const result = await axios.post<LoginResponse>(`${url}/login`, { username, password });
    if (result.data) {
      window.localStorage.setItem('loggedUser', JSON.stringify(result.data));
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.error) {
        return error.response?.data.error as string; 
      }
      return "Error in login";
    }
  }
  return null;
};

export const checkLogin = () => {
  const loginResponseJSON = window.localStorage.getItem('loggedUser');
  if (loginResponseJSON) {
    const loginResponse = JSON.parse(loginResponseJSON) as LoginResponse;
    console.log("returning");
    console.log(loginResponse);
    
    
    return loginResponse;
  }
  return;
};

export const userService = {
  tryLogin
};