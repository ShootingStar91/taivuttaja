import { Word, WordList } from "../types";
import axios from "axios";
import { baseUrl } from "../utils";

const url = baseUrl + 'wordlists'; // /api/wordlists/

const createWordlist = (wordList: WordList, userToken: string) => {
  console.log("sending createwordlist. token:" + userToken);
  
  const result = axios.post(url + '/create', { wordlist: wordList }, { headers: { Authorization: 'bearer ' + userToken}} );
  console.log("got back from createwordlist");
  
  return result;
};

const addWord = (word: Word, wordListId: string) => {
  const result = axios.post(url + `/add?=${wordListId}`, word);
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

const getWordList = async (id: string, userToken: string) => {
  try {    
    const response = await axios.get<WordList>(url + `/${id}`, { headers: { Authorization: 'bearer ' + userToken}} );
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