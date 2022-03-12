import axios from "axios";
import { baseUrl } from "../utils";

const url = baseUrl + 'user';

const tryLogin = async (username: string, password: string): Promise<string | null> => {
  console.log("sending post");
  
  const result = await axios.post(`${url}/login`, { username, password });
  
  if (result.data.user) {
    window.localStorage.setItem('loggedUser', JSON.stringify(result.data.user));
    return null;
  }
  
  return result.data.error as string;
  
};

export const userService = {
  tryLogin
};