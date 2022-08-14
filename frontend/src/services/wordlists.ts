/* eslint-disable @typescript-eslint/no-explicit-any */
import { WordList } from "../types";
import axios from "./index";
import { baseUrl } from "../config";
import { getHeader } from "./util";

const url = baseUrl + "wordlists"; // /api/wordlists/

const createWordlist = async (wordlist: WordList, token: string) => {
  const result = await axios.post<WordList>(
    url + "/create",
    { wordlist },
    getHeader(token)
  );
  return result.data;
};

const addWord = async (word: string, wordlistId: string, token: string) => {
  const result = await axios.post<WordList>(
    url + `/addword/`,
    { word, wordlistId },
    getHeader(token)
  );
  return result.data;
};

const deleteWord = async (word: string, wordlistId: string, token: string) => {
  const result = await axios.post<WordList>(
    url + `/deleteword/`,
    { word, wordlistId },
    getHeader(token)
  );
  return result.data;
};

const deleteWordlist = async (wordlistId: string, token: string) => {
  const result = await axios.post<boolean>(
    url + "/delete/",
    { wordlistId },
    getHeader(token)
  );
  return result;
};

const getWordLists = async (token: string) => {
  const response = await axios.get<WordList[]>(url + `/`, getHeader(token));
  return response.data;
};

const getWordList = async (id: string, token: string) => {
  const response = await axios.get<WordList>(url + `/${id}`, getHeader(token));
  return response.data;
};

export const wordListService = {
  createWordlist,
  addWord,
  deleteWord,
  getWordLists,
  getWordList,
  deleteWordlist,
};
