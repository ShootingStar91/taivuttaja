/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Mood, StrippedWord, Tense, Word } from '../types';
import { baseUrl } from '../config';
import { error, success } from './util';

const url = baseUrl + 'words'; // /api/words/

/*
 * getWord: null word gives random word,
 * null tense or mood gives 'Present' and 'Indicative' defaults
 */
const getWord = async (wordParam: string | null, langParam: string, moodParam: Mood | null, tenseParam: Tense | null) => {
  try {
    const mood: Mood = moodParam !== null ? moodParam : 'Indicative';
    const tense: Tense = tenseParam !== null ? tenseParam : 'Present';
    const word: string = wordParam !== null ? wordParam : '-';
    const lang = langParam;   
    const response = await axios.get<Word>(`${url}/word/${lang}/${word}/tense/${tense}/mood/${mood}`);
    return success<Word>(response.data);
  } catch (e: any) {
    return error(e);
  }
};

const getStrippedWords = async () => {
  try {
    const response = await axios.get<StrippedWord[]>(`${url}/allwordsstripped`);
    return success<StrippedWord[]>(response.data);
  } catch (e: any) {
    return error(e);
  }
};

export const wordService = {
  getWord,
  getStrippedWords,
};

