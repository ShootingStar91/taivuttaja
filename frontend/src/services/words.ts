import axios from 'axios';
import { Mood, StrippedWord, Tense, Word } from '../types';
import { baseUrl } from '../utils';

const url = baseUrl + 'words'; // /api/words/

/*
 * getWord: null word gives random word,
 * null tense or mood gives 'Present' and 'Indicative' defaults
 */
const getWord = async (wordParam: string | null, moodParam: Mood | null, tenseParam: Tense | null): Promise<Word | null> => {

  const mood: Mood = moodParam !== null ? moodParam : 'Indicative';
  const tense: Tense = tenseParam !== null ? tenseParam : 'Present';
  const word: string = wordParam !== null ? wordParam : '-';

  try {
    const response = await axios.get<Word | null>(`${url}/word/${word}/tense/${tense}/mood/${mood}`);
    console.log("Response from getRandomWord: ", response);
    return response.data;
  } catch (error: unknown) {
    console.log("error in getrandomword");
    console.log(error);
    throw (error);
  }
};

const getStrippedWords = async (): Promise<StrippedWord[] | null> => {
  try {
    const response = await axios.get<StrippedWord[] | null>(`${url}/allwordsstripped`);
    console.log("Response from getStrippedWords: ", response);
    return response.data;
  } catch (error: unknown) {
    console.log("error in getStrippedWords");
    console.log(error);
    throw (error);
  }};

export const wordService = {
  getWord,
  getStrippedWords,
};

