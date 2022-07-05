import app from './app';
import { PORT } from './config';
require('express-async-errors');

app.listen(PORT as number, '0.0.0.0', () => {
  console.log();
  console.log(`Server running on port ${PORT}`);
});
