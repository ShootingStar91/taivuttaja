import { wordModel } from "../models/Word";
import { Mood, StrippedWord, Tense, Word } from "../types";


const getWord = async (word: string, tense: Tense, mood: Mood) => {
  return await wordModel.find({ infinitive: word, mood_english: mood, tense_english: tense });
};

const getRandomWord = async (tense: Tense, mood: Mood) => {
  const wordArray = await wordModel.aggregate<Word>([{ $match: { tense_english: tense, mood_english: mood } }, { $sample: { size: 1 } }]);
  if (!wordArray || wordArray.length !== 1) {
    throw new Error("Error randoming word");
  }
  console.log("array len", wordArray.length);

  return wordArray[0];
};

const getStrippedWords = async () => {
  const result: StrippedWord[] = await wordModel.find({ tense_english: 'Present', mood_english: 'Indicative' }, 'infinitive infinitive_english');
  return result;
};

export default {
  getWord,
  getRandomWord,
  getStrippedWords
};
