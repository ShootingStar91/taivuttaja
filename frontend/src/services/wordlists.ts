import { WordList } from "../types";
import axios from "axios";
import { baseUrl } from "../utils";
import { getHeader } from "./util";

const url = baseUrl + 'wordlists'; // /api/wordlists/



const createWordlist = async (wordlist: WordList, token: string) => {
  try {
    const result = await axios.post<WordList>(url + '/create', { wordlist }, getHeader(token));
    return result;
  } catch (error: unknown) {
    console.log("error in createWordlist");
    console.log(error);
    throw (error);
  }
};

const addWord = async (word: string, wordlistId: string, token: string) => {
  console.log(word);
  console.log(wordlistId);
  
  
  try {
    const result = await axios.post(url + `/addword/`, {word, wordlistId}, getHeader(token));
    return result;
  } catch (error: unknown) {
    console.log("error in addWord");
    console.log(error);
    throw (error);
  }
};

const deleteWord = async (word: string, wordlistId: string, token: string) => {
  try {
    const result = await axios.post(url + `/deleteword/`, {word, wordlistId}, getHeader(token));
    return result;
  } catch (error: unknown) {
    console.log("error in deleteWord");
    console.log(error);
    throw (error);
  }
};

const deleteWordlist = async (wordlistId: string, token: string) => {
  try {
    const result = await axios.post(url + '/delete/', {wordlistId}, getHeader(token));
    return result;
  } catch (error: unknown) {
    console.log("error in deleteWordlist");
    console.log(error);
    throw (error);
  } 
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
  deleteWord,
  getWordLists,
  getWordList,
  deleteWordlist
};