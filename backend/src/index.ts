import express from 'express';
import mongoose from 'mongoose';
import middleware from './middleware';
import wordsRouter from './routes/words';
import userRouter from './routes/user';
import { PORT, MONGODB_URI, SECRET } from './config';

const app = express();

app.use(express.json());

app.use(express.static('build'));
app.use(middleware.logger);

app.get('/', (_req, res) => {
  res.send('Hola mundo, desde backend');
});

app.use('/api/words', wordsRouter);
app.use('/api/user', userRouter);


mongoose.connect(
  MONGODB_URI as string,
  { }).then(() => {
      console.log('Connected to MongoDB!');
    }).catch((error) => {
      console.log('Error connecting to MongoDB: ' + error.message);
    });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(MONGODB_URI + " " + SECRET);
});
