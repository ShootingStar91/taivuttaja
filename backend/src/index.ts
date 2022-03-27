/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import mongoose from 'mongoose';
import middleware from './middleware';
import wordsRouter from './routes/words';
import userRouter from './routes/user';
import { PORT, MONGODB_URI, SECRET } from './config';
import cors from 'cors';
//import { wordModel } from './models/Word';
const app = express();

app.use(express.json());
app.use(express.static('build'));
app.use(middleware.logger);
app.use(middleware.tokenExtractor);
app.get('/', (_req, res) => {
  res.send('Hola mundo, desde backend');
});



mongoose.connect(
  MONGODB_URI as string,
  { }).then(() => {
      console.log('Connected to MongoDB!');
    }).catch((error) => {
      console.log('Error connecting to MongoDB: ' + error.message);
    });


const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

// These have to be AFTER cors!
app.use('/api/words', wordsRouter);
app.use('/api/user', userRouter);
/*
const test = () => {
  const moods = ['Indicative', 'Subjunctive', 'Imperative'];
  const tenses = ['Present', 'Past', 'Future'];

  moods.forEach(mood => {
    tenses.forEach(async (tense) => {
      const result = await wordModel.find({ mood_english: mood, tense_english: tense }); 
      if (result) {
        console.log(`Mood: ${mood} Tense: ${tense} Amount: ${result.length}`);
      }
      });
  });

};

test();

const test2 = async () => {
  
  const result = await wordModel.find({ infinitive_english: "to run"}, 'tense_english mood_english'); //.select('+tense_english +mood_english -_id');
  result.forEach(res => {
    console.log(`${res.tense_english}   \t \t   ${res.mood_english}`);
    
  });
};
// eslint-disable-next-line @typescript-eslint/no-floating-promises
test2();
*/

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(MONGODB_URI + " " + SECRET);
});

