"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testExports = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
const validators_1 = require("../utils/validators");
const Wordlist_1 = require("../models/Wordlist");
const DoneWord_1 = require("../models/DoneWord");
const createPasswordHash = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, 10);
});
const parsePassword = (password) => {
    if (!password || !(0, validators_1.isString)(password)) {
        throw new types_1.ValidationError("Password is not a valid string");
    }
    if (password.length < config_1.PASSWORD_MIN_LENGTH ||
        password.length > config_1.PASSWORD_MAX_LENGTH) {
        throw new types_1.ValidationError(`Password must be between ${config_1.PASSWORD_MIN_LENGTH} and ${config_1.PASSWORD_MAX_LENGTH} characters long.`);
    }
    return password;
};
const parseUsername = (username) => {
    if (!username || !(0, validators_1.isString)(username)) {
        throw new types_1.ValidationError("Username is not a valid string");
    }
    if (username.length < config_1.USERNAME_MIN_LENGTH ||
        username.length > config_1.USERNAME_MAX_LENGTH) {
        throw new types_1.ValidationError(`Username must be between ${config_1.USERNAME_MIN_LENGTH} and ${config_1.USERNAME_MAX_LENGTH} characters long.`);
    }
    return username;
};
const toNewUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = {
        username: parseUsername(username),
        password: yield createPasswordHash(parsePassword(password)),
        strictAccents: false,
    };
    return newUser;
});
const createUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const rawUser = yield toNewUser(username, password);
    const newUser = new User_1.userModel(rawUser);
    const result = yield newUser.save();
    if (!result) {
        throw new Error("Error when creating user in backend");
    }
    return true;
});
const tryLogin = (rawUsername, rawPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const username = parseUsername(rawUsername);
    const password = parsePassword(rawPassword);
    const user = yield User_1.userModel.findOne({ username });
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.password) {
        throw new Error("User did not have password in database");
    }
    const result = yield bcrypt_1.default.compare(password, user.password);
    if (!result) {
        throw new Error("Invalid password");
    }
    const userForToken = { username: user.username, id: user._id };
    const token = jsonwebtoken_1.default.sign(userForToken, config_1.SECRET, {
        expiresIn: config_1.LOGIN_VALID_SECONDS,
    });
    const foundUser = {
        username: user.username,
        _id: user._id,
        goal: user.goal,
        token,
        strictAccents: user.strictAccents,
    };
    return foundUser;
});
const deleteUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield Wordlist_1.wordlistModel.deleteMany({ owner: user._id });
    const result = yield User_1.userModel.deleteOne({ owner: user._id });
    if (!result) {
        throw new Error("Could not find such user");
    }
    return true;
});
const addDoneWord = (wordId, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, validators_1.isString)(wordId)) {
        throw new types_1.ValidationError("Invalid wordId");
    }
    const newDoneWord = new DoneWord_1.doneWordModel({
        word: wordId,
        date: new Date(),
        user: user._id,
    });
    const result = yield newDoneWord.save();
    if (!result) {
        throw new Error("Could not add done word");
    }
    return result;
});
const getDoneWords = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield DoneWord_1.doneWordModel
        .find({ user: user._id })
        .populate({ path: "word", model: "Word" });
    if (!result) {
        throw new Error("Could not get done words");
    }
    return result;
});
const setGoal = (goal, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Number.isInteger(goal)) {
        throw new types_1.ValidationError("Invalid goal parameter");
    }
    const result = yield User_1.userModel.updateOne({ _id: user._id }, { goal });
    if (!result) {
        throw new Error("Error updating user for setting daily goal");
    }
    return true;
});
const changePassword = (rawOldPassword, rawNewPassword, user) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = yield createPasswordHash(parsePassword(rawNewPassword));
    const oldPassword = parsePassword(rawOldPassword);
    const dbUser = yield User_1.userModel.findOne({ _id: user._id });
    if (!dbUser || !dbUser.password) {
        throw new Error("User not found");
    }
    const passwordCorrect = yield bcrypt_1.default.compare(oldPassword, dbUser.password);
    if (!passwordCorrect) {
        throw new Error("Invalid password");
    }
    const result = yield User_1.userModel.updateOne({ _id: user._id }, { password: newPassword });
    if (!result) {
        throw new Error("Error updating user to database");
    }
    return true;
});
const setStrictAccents = (strictAccents, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, validators_1.isBoolean)(strictAccents)) {
        throw new types_1.ValidationError("Strict accents parameter was not boolean");
    }
    const result = yield User_1.userModel.updateOne({ _id: user._id }, { strictAccents });
    if (!result) {
        throw new Error("Could not update strict accents");
    }
    return true;
});
exports.default = {
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
exports.testExports = testExports;
