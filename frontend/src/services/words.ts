/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./index";
import { Mood, StrippedWord, Tense, Word } from "../types";
import { baseUrl } from "../config";

const url = baseUrl + "words"; // /api/words/

/*
 * getWord: null word gives random word,
 * null tense or mood gives 'Present' and 'Indicative' defaults
 */
const getWord = async (
  wordParam: string | null,
  langParam: string,
  moodParam: Mood | null,
  tenseParam: Tense | null
) => {
  const mood: Mood = moodParam !== null ? moodParam : "Indicative";
  const tense: Tense = tenseParam !== null ? tenseParam : "Present";
  const word: string = wordParam !== null ? wordParam : "-";
  const lang = langParam;
  const response = await axios.get<Word>(
    `${url}/word/${lang}/${word}/tense/${tense}/mood/${mood}`
  );
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
  getStrippedWords,
  getVerbDetails,
};
