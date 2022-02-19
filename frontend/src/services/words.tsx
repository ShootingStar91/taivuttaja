import axios from 'axios';
import { Word } from '../types';

const baseUrl = 'http://localhost:3001/api/words';

const getRandomWord = async (): Promise<Word[]> => {

  try {
    const response = await axios.get<Word[]>(`${baseUrl}/random`);
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

