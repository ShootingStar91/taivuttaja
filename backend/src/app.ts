/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import mongoose from 'mongoose';
import middleware from './middleware';
import wordsRouter from './routes/words';
import userRouter from './routes/user';
import wordlistsRouter from './routes/wordlists';
import {  MONGODB_URI, TEST_MONGODB_URI, TEST_MODE } from './config';
import cors from 'cors';
import { userModel } from './models/User';
require('express-async-errors');

//import { wordModel } from './models/Word';
const app = express();

app.use(express.json());
app.use(express.static('build'));
app.use(middleware.logger);
app.use(middleware.tokenExtractor);

if (TEST_MODE) { 
  console.log("Running in TEST_MODE");
} else {
  console.log("Running in normal mode");
}

const mongo_url = TEST_MODE ? TEST_MONGODB_URI as string : MONGODB_URI as string;
mongoose.connect(
  mongo_url,
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

app.use('/api/words', wordsRouter);
app.use('/api/user', userRouter);
app.use('/api/wordlists', wordlistsRouter);
app.get('/health', (_req, res) => {
  res.send('ok');
});
app.get('/version', (_req, res) => {
  res.send('1.0.1');
});
app.get('/api/test/deleteall', async (_req, res) => {
  if (!TEST_MODE) {
    res.send("Not in test mode!");
  }
  await userModel.deleteMany({});
  console.log("users deleted");
  res.send("ok");
});
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
export default app;