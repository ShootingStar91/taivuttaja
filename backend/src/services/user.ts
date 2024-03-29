/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, userModel } from "../models/User";
import bcrypt from "bcrypt";
import {
  LOGIN_VALID_SECONDS,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  SECRET,
} from "../config";
import jwt, { Secret } from "jsonwebtoken";
import { ValidationError } from "../types";
import { isBoolean, isString } from "../utils/validators";
import { wordlistModel } from "../models/Wordlist";
import { doneWordModel } from "../models/DoneWord";

type RawUser = Omit<User, "_id">;

const createPasswordHash = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const parsePassword = (password: any) => {
  if (!password || !isString(password)) {
    throw new ValidationError("Password is not a valid string");
  }
  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    throw new ValidationError(
      `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters long.`
    );
  }
  return password;
};

const parseUsername = (username: any) => {
  if (!username || !isString(username)) {
    throw new ValidationError("Username is not a valid string");
  }
  if (
    username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH
  ) {
    throw new ValidationError(
      `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters long.`
    );
  }
  return username;
};

const toNewUser = async (
  username: unknown,
  password: unknown
): Promise<RawUser> => {
  const newUser: RawUser = {
    username: parseUsername(username),
    password: await createPasswordHash(parsePassword(password)),
    strictAccents: false,
  };
  return newUser;
};

const createUser = async (username: unknown, password: unknown) => {
  const rawUser = await toNewUser(username, password);

  const newUser = new userModel(rawUser);

  const result = await newUser.save();
  if (!result) {
    throw new Error("Error when creating user in backend");
  }
  return true;
};

const tryLogin = async (
  rawUsername: unknown,
  rawPassword: unknown
): Promise<User> => {
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
  const token = jwt.sign(userForToken, SECRET as Secret, {
    expiresIn: LOGIN_VALID_SECONDS,
  });
  const foundUser: User = {
    username: user.username,
    _id: user._id,
    goal: user.goal,
    token,
    strictAccents: user.strictAccents,
  };
  return foundUser;
};

const deleteUser = async (user: User) => {
  await wordlistModel.deleteMany({ owner: user._id });

  const result = await userModel.deleteOne({ owner: user._id });

  if (!result) {
    throw new Error("Could not find such user");
  }
  return true;
};

const addDoneWord = async (wordId: unknown, user: User) => {
  if (!isString(wordId)) {
    throw new ValidationError("Invalid wordId");
  }

  const newDoneWord = new doneWordModel({
    word: wordId,
    date: new Date(),
    user: user._id,
  });

  const result = await newDoneWord.save();
  if (!result) {
    throw new Error("Could not add done word");
  }
  return result;
};

const getDoneWords = async (user: User) => {
  const result = await doneWordModel
    .find({ user: user._id })
    .populate({ path: "word", model: "Word" });

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
  if (!result) {
    throw new Error("Error updating user for setting daily goal");
  }
  return true;
};

const changePassword = async (
  rawOldPassword: unknown,
  rawNewPassword: unknown,
  user: User
) => {
  const newPassword = await createPasswordHash(parsePassword(rawNewPassword));
  const oldPassword = parsePassword(rawOldPassword);

  const dbUser = await userModel.findOne({ _id: user._id });

  if (!dbUser || !dbUser.password) {
    throw new Error("User not found");
  }

  const passwordCorrect = await bcrypt.compare(oldPassword, dbUser.password);
  if (!passwordCorrect) {
    throw new Error("Invalid password");
  }
  const result = await userModel.updateOne(
    { _id: user._id },
    { password: newPassword }
  );
  if (!result) {
    throw new Error("Error updating user to database");
  }
  return true;
};

const setStrictAccents = async (strictAccents: unknown, user: User) => {
  if (!isBoolean(strictAccents)) {
    throw new ValidationError("Strict accents parameter was not boolean");
  }
  const result = await userModel.updateOne(
    { _id: user._id },
    { strictAccents }
  );
  if (!result) {
    throw new Error("Could not update strict accents");
  }
  return true;
};

export default {
  createUser,
  tryLogin,
  deleteUser,
  addDoneWord,
  getDoneWords,
  setGoal,
  changePassword,
  setStrictAccents,
};

const testExports = {
  parsePassword,
  parseUsername,
  toNewUser,
};

export { testExports };
