import { WORDLIST_TITLE_MAX, WORDLIST_TITLE_MIN } from "../config";
import { wordlistModel } from "../models/Wordlist";
import { isString } from "../utils/validators";

export const isWordArray = (words: unknown): words is string[] => {
  // Possibly useless typeguard
  if (!Array.isArray(words)) {
    return false;
  }
  if (words.length === 0 || typeof words[0] !== "string") {
    return false;
  }
  return true;
};

const addWord = async (word: unknown, wordlistId: unknown, userId: string) => {
  if (!isString(word) || !isString(wordlistId)) {
    throw new Error("Invalid parameters");
  }
  const result = await wordlistModel.findOneAndUpdate({ _id: wordlistId, owner: userId }, { $push: { words: word } });

  if (!result) {
    throw new Error('Wordlist not found');
  }
  return result;
};

const deleteWord = async (word: unknown, wordlistId: unknown, userId: string) => {
  if (!isString(word) || !isString(wordlistId)) {
    throw new Error("Invalid parameters");
  }

  const result = await wordlistModel.findOneAndUpdate({ _id: wordlistId, owner: userId }, { $pull: { words: word } });

  if (!result) {
    throw new Error('Wordlist not found');
  }

};

const deleteWordlist = async (wordlistId: unknown, userId: string) => {
  if (!isString(wordlistId)) {
    throw new Error("Invalid parameters");
  }

  const result = await wordlistModel.findOneAndRemove({ _id: wordlistId, owner: userId});

  if (!result) {
    throw new Error('Wordlist not found');
  }

};

const create = async (title: unknown, userId: string) => {
  if (!isString(title) || title.length < WORDLIST_TITLE_MIN || title.length > WORDLIST_TITLE_MAX) {
    throw new Error(`Wordlist title must be a valid string of length ${WORDLIST_TITLE_MIN}-${WORDLIST_TITLE_MAX}`);
  }

  const words: string[] = [];

  const newWordlist = new wordlistModel({ title, words, owner: userId });
  const savedWordlist = await newWordlist.save();
  if (!savedWordlist) {
    throw new Error("Creating wordlist failed on database");
  }
  return savedWordlist;
};

const getUsersLists = async (userId: string) => {
  return await wordlistModel.find({ owner: userId });
};

const getList = async (wordlistId: unknown, userId: string) => {
  if (!isString(wordlistId)) {
    throw new Error("Invalid parameters");
  }
  const wordlist = await wordlistModel.findOne({ _id: wordlistId, owner: userId });
  if (!wordlist) {
    throw new Error("No such wordlist id found from this user");
  }
  return wordlist;

};

export default {
  create,
  addWord,
  deleteWord,
  getUsersLists,
  getList,
  deleteWordlist
};


