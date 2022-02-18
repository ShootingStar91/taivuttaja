import express from 'express';
import { wordModel } from '../models/Word';

const router = express.Router();

// /api/words/...

router.get(`/`, (_req, res) => {
    const kysely = async () => {
      const word = await wordModel.find({ infinitive: 'correr' });
      res.send(word);
      console.log(word);
    };
    void kysely();
});

export default router;