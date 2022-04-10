/* eslint-disable @typescript-eslint/no-misused-promises */
require('express-async-errors');

import express from 'express';
import wordService from '../services/words';
import { isMood, isString, isTense, isLanguage } from '../utils/validators';


const router = express.Router();

// /api/words/...

/*

  get / -path will return a single word in the desired tense and mood.
  Omitting word will result in a random word.
  omit by -, example
  /api/words/word/en/-/tense/Present/mood/Indicative/
  after /word/ comes language of the given word param: 'en' or 'es'
*/

router.get('/word/:lang/:word/tense/:tense/mood/:mood/', async (req, res) => {

  const word = req.params.word;
  const rawMood = req.params.mood;
  const rawTense = req.params.tense;
  const lang = req.params.lang;

  if (!isLanguage(lang)) {
    throw new Error("Invalid language parameter. Give either 'en' or 'es'");
  }
  
  if (!rawMood || !rawTense) {
    throw new Error("Mood or tense missing");
  }

  const mood = rawMood.charAt(0).toUpperCase() + rawMood.slice(1);
  const tense = rawTense.charAt(0).toUpperCase() + rawTense.slice(1);

  if (!isMood(mood) || !isTense(tense)) {
    throw new Error("Mood or tense invalid");
  }

  console.log(`Getting word ${word}, mood ${mood}, tense ${tense}`);

  if (isString(word) && word !== '-') {
    // Get specific word
    const result = await wordService.getWord(word, lang, tense, mood);
    return res.send(result);
  } else if (isString(word) && word === '-') {
    const word = await wordService.getRandomWord(tense, mood);
    return res.send(word);
  }

  throw new Error("Word invalid. Either give valid string word, or a dash (-) for random.");

});

router.get('/random', async (_req, res, _next) => {
  const word = await wordService.getRandomWord('Present', 'Indicative');
  res.send(word);
});


router.get('/allwordsstripped', async (_req, res, _next) => {
  const result = await wordService.getStrippedWords();

  res.send(result);
});



export default router;