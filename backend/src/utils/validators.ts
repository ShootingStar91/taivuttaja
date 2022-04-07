import { Tense, tenseList, Mood, moodList } from "../types";

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isTense = (text: unknown): text is Tense => {
  return isString(text) && tenseList.includes(text);
};

export const isMood = (text: unknown): text is Mood => {
  return isString(text) && moodList.includes(text);
};
