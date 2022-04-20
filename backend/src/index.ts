/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import mongoose from 'mongoose';
import middleware from './middleware';
import wordsRouter from './routes/words';
import userRouter from './routes/user';
import wordlistsRouter from './routes/wordlists';
import { PORT, MONGODB_URI } from './config';
import cors from 'cors';
import { moodList, tenseList } from './types';
import { wordModel } from './models/Word';
require('express-async-errors');

//import { wordModel } from './models/Word';
const app = express();

app.use(express.json());
app.use(express.static('build'));
app.use(middleware.logger);
app.use(middleware.tokenExtractor);

mongoose.connect(
  MONGODB_URI as string,
  {}).then(() => {
    console.log('Connected to MongoDB!');
  }).catch((error) => {
    console.log('Error connecting to MongoDB: ' + error.message);
  });

// Temporary snippet for gathering all valid combinations of moods and tenses existing in the database
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
    if ((w.form_1p === "" || w.form_2p === "" || w.form_3p === "" || w.form_1s === "" || w.form_2s === "" || w.form_3s === "") && w.mood_english === "Indicative") {
      console.log(w);
    }
  });
};

void checkEmptyForms();

const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

// These have to be AFTER cors!
app.use('/api/words', wordsRouter);
app.use('/api/user', userRouter);
app.use('/api/wordlists', wordlistsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(PORT, () => {
  console.log();
  console.log(`Server running on port ${PORT}`);
});

