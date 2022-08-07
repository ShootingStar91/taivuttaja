/* eslint-disable @typescript-eslint/no-explicit-any */
import { WordList } from "../types";
import axios from "./index";
import { baseUrl } from "../config";
import { getHeader, success, error } from "./util";

const url = baseUrl + "wordlists"; // /api/wordlists/

const createWordlist = async (wordlist: WordList, token: string) => {
  try {
    const result = await axios.post<WordList>(
      url + "/create",
      { wordlist },
      getHeader(token)
    );
    return success<WordList>(result.data);
  } catch (e: any) {
    return error(e);
  }
};

const addWord = async (word: string, wordlistId: string, token: string) => {
  try {
    const result = await axios.post<WordList>(
      url + `/addword/`,
      { word, wordlistId },
      getHeader(token)
    );
    return success<WordList>(result.data);
  } catch (e: any) {
    return error(e);
  }
};

const deleteWord = async (word: string, wordlistId: string, token: string) => {
  try {
    const result = await axios.post<WordList>(
      url + `/deleteword/`,
      { word, wordlistId },
      getHeader(token)
    );
    return success<WordList>(result.data);
  } catch (e: any) {
    return error(e);
  }
};

const deleteWordlist = async (wordlistId: string, token: string) => {
  try {
    const result = await axios.post<WordList>(
      url + "/delete/",
      { wordlistId },
      getHeader(token)
    );
    return success<WordList>(result.data);
  } catch (e: any) {
    return error(e);
  }
};

const getWordLists = async (token: string) => {
  try {
    const response = await axios.get<WordList[]>(url + `/`, getHeader(token));
    return success<WordList[]>(response.data);
  } catch (e: any) {
    return error(e);
  }
};

const getWordList = async (id: string, token: string) => {
  try {
    const response = await axios.get<WordList>(
      url + `/${id}`,
      getHeader(token)
    );
    return success<WordList>(response.data);
  } catch (e: any) {
    return error(e);
  }
};

export const wordListService = {
  createWordlist,
  addWord,
  deleteWord,
  getWordLists,
  getWordList,
  deleteWordlist,
};
