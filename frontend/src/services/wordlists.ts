import { Word, WordList } from "../types";
import axios from "axios";
import { baseUrl } from "../utils";

const url = baseUrl + 'wordlists'; // /api/wordlists/

const getHeader = (token: string) => {
  return { headers: { Authorization: 'bearer ' + token}};
};

const createWordlist = (wordList: WordList, token: string) => {
  const result = axios.post(url + '/create', { wordlist: wordList }, getHeader(token));  
  return result;
};

const addWord = (word: Word, wordListId: string) => {
  const result = axios.post(url + `/add?=${wordListId}`, word);
  return result;
};

const getWordLists = async (token: string) => {
  try {
    const response = await axios.get<WordList[]>(url + `/`, getHeader(token));
    return response.data;
  } catch (error: unknown) {
    console.log("error in getWordLists");
    console.log(error);
    throw (error);
  }
};

const getWordList = async (id: string, token: string) => {
  try {    
    const response = await axios.get<WordList>(url + `/${id}`, getHeader(token));
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