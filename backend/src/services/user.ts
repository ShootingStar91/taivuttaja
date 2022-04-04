/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, userModel } from "../models/User";
import bcrypt from 'bcrypt';
import { loginValidSeconds, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, SECRET } from '../config';
import jwt, { Secret } from "jsonwebtoken";
import { LoginResponse } from "../types";

type RawUser = Omit<User, '_id'>;

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const createPasswordHash = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const parsePassword = (password: any) => {
  if (!password || !isString(password)) {
    throw new Error("Password is not a valid string");
  }
  if (password.length < PASSWORD_MIN_LENGTH ||
      password.length > PASSWORD_MAX_LENGTH) {
        throw new Error(`Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters long.`);
      }
  return password;
};

const parseUsername = (username: any) => {
  if (!username || !isString(username)) {
    throw new Error("Username is not a valid string");
  }
  if (username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH) {
      throw new Error(`Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters long.`);
    }
  return username;
};

const toNewUser = async (username: unknown, password: unknown): Promise<RawUser> => {
  const newUser: RawUser = {
    username: parseUsername(username),
    password: await createPasswordHash(parsePassword(password)),

  };
  return newUser;
};

const createUser = async (username: unknown, password: unknown) => {  
  const rawUser = await toNewUser(username, password);

  const newUser = new userModel(rawUser);

  try {
    await newUser.save();
  } catch (e) {
    throw new Error(`Error saving new user into database: ${e}`);
  }
};

const tryLogin = async (rawUsername: unknown, rawPassword: unknown): Promise<LoginResponse> => {
  const username = parseUsername(rawUsername);
  const password = parsePassword(rawPassword);
  const user = await userModel.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }
  
  bcrypt.compare(password, user.password, (_err, result) => {
    if (!result) {
      throw new Error("Invalid password");
    }
  });

  const userForToken = { username: user.username, id: user._id };
  const token = jwt.sign(userForToken, SECRET as Secret, { expiresIn: loginValidSeconds });
  
  return { user, token } as LoginResponse;

};

export default {
  createUser,
  tryLogin
};