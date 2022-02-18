import express from 'express';
const router = express.Router();

// /api/user/...

router.get(`/`, (_req, res) => {
  res.send('hello user');
});

export default router;