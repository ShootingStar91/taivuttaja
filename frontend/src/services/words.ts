import axios from 'axios';
import { Mood, StrippedWord, Tense, Word } from '../types';
import { baseUrl } from '../utils';

const url = baseUrl + 'words'; // /api/words/

/*
 * getWord: null word gives random word,
 * null tense or mood gives 'Present' and 'Indicative' defaults
 */
const getWord = async (wordParam: string | null, langParam: string, moodParam: Mood | null, tenseParam: Tense | null): Promise<Word | null> => {

  const mood: Mood = moodParam !== null ? moodParam : 'Indicative';
  const tense: Tense = tenseParam !== null ? tenseParam : 'Present';
  const word: string = wordParam !== null ? wordParam : '-';
  const lang = langParam;

  const response = await axios.get<Word | null>(`${url}/word/${lang}/${word}/tense/${tense}/mood/${mood}`);
  return response.data;

};

const getStrippedWords = async (): Promise<StrippedWord[] | null> => {
  
  const response = await axios.get<StrippedWord[] | null>(`${url}/allwordsstripped`);
  console.log("Response from getStrippedWords: ", response);
  return response.data;

};

export const wordService = {
  getWord,
  getStrippedWords,
};

