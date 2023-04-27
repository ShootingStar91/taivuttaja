/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import mongoose from 'mongoose';
import middleware from './middleware';
import wordsRouter from './routes/words';
import userRouter from './routes/user';
import wordlistsRouter from './routes/wordlists';
import { MONGODB_URI, TEST_MODE } from './config';
import cors from 'cors';
import { userModel } from './models/User';
require('express-async-errors');

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:80'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true
};

app.use(cors(options));

app.use(express.json());
app.use(express.static('build'));

if (TEST_MODE) {
  app.use(middleware.logger);
}

app.use(middleware.tokenExtractor);

if (TEST_MODE) { 
  console.log('Running in TEST_MODE');
} else {
  console.log('Running in normal mode');
}

const mongo_url = MONGODB_URI as string

mongoose.connect(
  mongo_url,
  {}).then(() => {
    console.log('Connected to MongoDB!');
  }).catch((error) => {
    console.log('Error connecting to MongoDB: ' + error.message);
  });

app.use('/api/words', wordsRouter);
app.use('/api/user', userRouter);
app.use('/api/wordlists', wordlistsRouter);
app.get('/api/health', (_req, res) => {
  res.send('ok');
});
app.get('/api/test/deleteall', async (_req, res) => {
  if (!TEST_MODE) {
    res.send('Not in test mode!');
  }
  await userModel.deleteMany({});
  console.log('users deleted');
  res.send('ok');
});
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
export default app;
