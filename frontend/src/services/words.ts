import axios from 'axios';
import { Word } from '../types';
import { baseUrl } from '../utils';

const url = baseUrl + 'words'; // /api/words/


const getRandomWord = async (): Promise<Word | null> => {

  try {
    const response = await axios.get<Word | null>(`${url}/random`);
    console.log("Response from getRandomWord: ", response);
    return response.data;
  } catch (error: unknown) {
    console.log("error in getrandomword");
    console.log(error);
    throw (error);
  }
};

export const wordService = {
  getRandomWord
};

