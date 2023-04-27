import axios from "./index";
import { Mood, StrippedWord, Tense, Word } from "../types";
import { baseUrl } from "../config";

const url = baseUrl + "words";

// /api/words/

const getWord = async (
  word: string,
  language: string,
  mood: Mood,
  tense: Tense
) => {
  const response = await axios.get<Word>(`${url}/word/`, {
    params: { word, language, mood, tense },
  });
  return response.data;
};

const getRandomWord = async (mood: Mood, tense: Tense) => {
  const response = await axios.get<Word>(`${url}/random/`, {
    params: { mood, tense },
  });
  return response.data;
};

const getStrippedWords = async () => {
  const response = await axios.get<StrippedWord[]>(`${url}/allwordsstripped`);
  return response.data;
};

const getVerbDetails = async (verb: string) => {
  const response = await axios.get<Word[]>(`${url}/verbdetails/${verb}`);
  return response.data;
};

export const wordService = {
  getWord,
  getRandomWord,
  getStrippedWords,
  getVerbDetails,
};
