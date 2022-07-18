/* eslint-disable @typescript-eslint/no-misused-promises */
// Temporary snippets for gathering all valid combinations of moods and tenses existing in the database

import { wordModel } from '../models/Word';
import { tenseList, moodList } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const checkValidMoodTenses = () => {
  tenseList.forEach(tense => {
    moodList.forEach(async (mood) => {
      const wordCount = await wordModel.countDocuments({ mood_english: mood, tense_english: tense }).count();
      if (wordCount > 0) console.log(`${mood}, ${tense}, ${wordCount}`);
    });
  });
};

export const checkEmptyForms = async () => {
  const words = await wordModel.find({});
  words.forEach(w => {
    if ((w.form_1p === '' || w.form_2p === '' || w.form_3p === '' || w.form_1s === '' || w.form_2s === '' || w.form_3s === '') && w.mood_english === 'Indicative') {
      console.log(w);
    }
  });
};