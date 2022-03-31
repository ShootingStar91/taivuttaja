/* eslint-disable @typescript-eslint/no-misused-promises */

import express from 'express';
import { wordModel } from '../models/Word';
import { Word } from '../types';
import { StrippedWord } from '../types';

const router = express.Router();

const words: Word[] = [];
const strippedWords: StrippedWord[] = [];

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
  if (words.length === 0) {
    words.push( ... await wordModel.find({ mood_english: 'Indicative', tense_english: 'Present' }));
    console.log(words.length);
  }
  
  if (words.length === 0) {
    res.send(null);
  } else {
    const randomIndex = Math.floor(Math.random() * (words.length));
    const randomedWord = words[randomIndex];    
    res.send(randomedWord);
  }
});


router.get('/allwordsstripped', async (_req, res, _next) => {
  if (strippedWords.length === 0) {
    const result = await wordModel.find({ tense_english: 'Present', mood_english: 'Indicative' }, 'infinitive infinitive_english');
    if (result) {
      result.forEach((word) => {
        const strippedWord: StrippedWord = { english: word.infinitive_english, spanish: word.infinitive, id: word._id.toString() };
        strippedWords.push(strippedWord);
      });
    }
  }
  console.log("returning " + strippedWords.length + " words");
  
  res.send(strippedWords);
});



export default router;