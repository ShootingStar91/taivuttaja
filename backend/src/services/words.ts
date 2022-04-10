import { wordModel } from "../models/Word";
import { Language, Mood, StrippedWord, Tense, Word } from "../types";


const getWord = async (word: string, language: Language, tense: Tense, mood: Mood) => {
  if (language === Language.English) {
    return await wordModel.findOne({ infinitive_english: word, mood_english: mood, tense_english: tense });
  } else {
    return await wordModel.findOne({ infinitive: word, mood_english: mood, tense_english: tense });
  }
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
