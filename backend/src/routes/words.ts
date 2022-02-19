/* eslint-disable @typescript-eslint/no-misused-promises */

import express from 'express';
import { wordModel } from '../models/Word';

const router = express.Router();

// /api/words/...

router.get('/:word-:tense-:mood/', async (req, res, next) => {
  console.log("word tense mood");
  
  if (req.params && req.params.word) {
    const word = req.params.word;
    const rawMood = req.params.mood ? req.params.mood : 'Indicative';
    const rawTense = req.params.tense ? req.params.tense : 'Present';

    const mood = rawMood.charAt(0).toUpperCase() + rawMood.slice(1);
    const tense = rawTense.charAt(0).toUpperCase() + rawTense.slice(1);

    console.log(`Getting word ${word}, mood ${mood}, tense ${tense}`);
    const result = await wordModel.find({ infinitive: word, mood_english: mood, tense_english: tense });

    res.send(result);
  } else {
    const err = new Error('Supply a word as parameter');
    res.status(400);
    next(err);
  }
});

router.get('/random', async (_req, res, _next) => {
  console.log("moi from random");
  const result = await wordModel.find({ infinitive: 'correr', mood_english: 'Indicative', tense_english: 'Present' });
  res.send(result);
});

export default router;