import express from 'express';
const router = express.Router();

// /api/words/...

router.get(`/`, (_req, res) => {
  res.send('la palabra');
});

export default router;