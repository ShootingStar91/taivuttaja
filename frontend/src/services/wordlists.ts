import { Word, WordList } from "../types";
import axios from "axios";
import { baseUrl } from "../utils";

const url = baseUrl + 'wordlists'; // /api/wordlists/

const createWordlist = (wordList: WordList) => {
  const result = axios.put(url + '/create', wordList);
  return result;
};

const addWord = (word: Word, wordListId: string) => {
  const result = axios.put(url + `/add?=${wordListId}`, word);
  return result;
};

const getWordLists = async (userId: string) => {
  try {
    const response = await axios.get<WordList[]>(url + `/${userId}`);
    return response.data;
  } catch (error: unknown) {
    console.log("error in getWordLists");
    console.log(error);
    throw (error);
  }
};

const getWordList = async (id: string) => {
  try {
    const response = await axios.get<WordList>(url + `/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.log("error in getWordList");
    console.log(error);
    throw (error);
  }
};

export const wordListService = {
  createWordlist,
  addWord,
  getWordLists,
  getWordList
};