import express from 'express';

const app = express();

app.use(express.json());

app.use(express.static('build'));

app.get('/', (_req, res) => {
  res.send('Hola mundo, desde backend');
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('file ran');