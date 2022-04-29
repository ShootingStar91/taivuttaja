import { Tense, tenseList, Mood, moodList, Language } from "../types";

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isBoolean = (variable: unknown): variable is boolean => {
  return typeof variable == "boolean";
};



export const isTense = (text: unknown): text is Tense => {
  return isString(text) && tenseList.includes(text);
};

export const isMood = (text: unknown): text is Mood => {
  return isString(text) && moodList.includes(text);
};

export const isLanguage = (text: unknown): text is Language => {
  return isString(text) && text === Language.English || text === Language.Spanish;
};

