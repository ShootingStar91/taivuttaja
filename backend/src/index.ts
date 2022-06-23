/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import mongoose from 'mongoose';
import middleware from './middleware';
import wordsRouter from './routes/words';
import userRouter from './routes/user';
import wordlistsRouter from './routes/wordlists';
import { PORT, MONGODB_URI } from './config';
import cors from 'cors';
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




const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

// These have to be AFTER cors!
app.use('/api/words', wordsRouter);
app.use('/api/user', userRouter);
app.use('/api/wordlists', wordlistsRouter);
app.get('/health', (_req, res) => {
  res.send('ok');
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(PORT, () => {
  console.log();
  console.log(`Server running on port ${PORT}`);
});

