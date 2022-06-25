const app = require('./app.ts');
import { PORT } from './config';
require('express-async-errors');

app.listen(PORT, () => {
  console.log();
  console.log(`Server running on port ${PORT}`);
});
