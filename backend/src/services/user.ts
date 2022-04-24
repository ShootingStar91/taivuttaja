/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, userModel } from "../models/User";
import bcrypt from 'bcrypt';
import { loginValidSeconds, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, SECRET } from '../config';
import jwt, { Secret } from "jsonwebtoken";
import { DoneWord, ValidationError } from "../types";
import { isString } from '../utils/validators';
import { wordlistModel } from "../models/Wordlist";
import { doneWordModel } from "../models/DoneWord";

type RawUser = Omit<User, '_id'>;


const createPasswordHash = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const parsePassword = (password: any) => {
  if (!password || !isString(password)) {
    throw new ValidationError("Password is not a valid string");
  }
  if (password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH) {
    throw new ValidationError(`Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters long.`);
  }
  return password;
};

const parseUsername = (username: any) => {
  if (!username || !isString(username)) {
    throw new ValidationError('Username is not a valid string');
  }
  if (username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH) {
    throw new ValidationError(`Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters long.`);
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

  await newUser.save();


};

const tryLogin = async (rawUsername: unknown, rawPassword: unknown): Promise<User> => {
  const username = parseUsername(rawUsername);
  const password = parsePassword(rawPassword);
  const user = await userModel.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }
  if (!user.password) {
    throw new Error("User did not have password in database");
  }

  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    throw new Error("Invalid password");
  }

  const userForToken = { username: user.username, id: user._id };
  const token = jwt.sign(userForToken, SECRET as Secret, { expiresIn: loginValidSeconds });
  const foundUser: User = {username: user.username, _id: user._id, goal: user.goal, token };
  return foundUser;

};

const relog = (user: User) => {
  const userForToken = { username: user.username, id: user._id };
  const token = jwt.sign(userForToken, SECRET as Secret, { expiresIn: loginValidSeconds });
  user.token = token;
  return user;
};

const deleteUser = async (user: User) => {

  await wordlistModel.deleteMany({ owner: user._id });

  const result = await userModel.deleteOne({ owner: user._id });

  if (!result) {
    throw new Error("Could not find such user");
  }

};

const addDoneWord = async (wordId: unknown, user: User) => {
  if (!isString(wordId)) {
    throw new ValidationError("Invalid wordId");
  }
  const rawDoneWord: DoneWord = { word: wordId, date: new Date(), user: user._id };
  const newDoneWord = new doneWordModel(rawDoneWord);
  const result = await newDoneWord.save();
  if (!result) {
    throw new Error("Could not add done word");
  }
};

const getDoneWords = async (user: User) => {
  const result = await doneWordModel.find({ user: user._id });
  if (!result) {
    throw new Error("Could not get done words");
  }
  return result;
};

const setGoal = async (goal: unknown, user: User) => {
  if (!Number.isInteger(goal)) {
    throw new ValidationError("Invalid goal parameter");
  }
  const result = await userModel.updateOne({ _id: user._id }, { goal });
  return result;
};

const changePassword = async (rawPassword: unknown, user: User) => {
  const password = await createPasswordHash(parsePassword(rawPassword));

  const result = await userModel.updateOne({ _id: user._id }, { password });
  return result;
};


export default {
  createUser,
  tryLogin,
  deleteUser,
  addDoneWord,
  getDoneWords,
  setGoal,
  changePassword,
  relog
};

