import express from 'express';
import middleware from './middleware';
import wordsRouter from './routes/words';
import userRouter from './routes/user';
import { PORT } from './config';

const app = express();

app.use(express.json());

app.use(express.static('build'));
app.use(middleware.logger);

app.get('/', (_req, res) => {
  res.send('Hola mundo, desde backend');
});

app.use('/api/words', wordsRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
