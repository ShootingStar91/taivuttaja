/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { wordlistModel } from '../models/Wordlist';
import middleware from '../middleware';

const router = express.Router();


router.get('/', middleware.userExtractor, async (req, res, next) => {
  if (!req.user || !req.user._id) {
    const err = new Error('Supply valid user token');
    res.status(400);
    return next(err);
  }
  const userId = req.user._id;  
  const result = await wordlistModel.find({ owner: userId });
  
  if (result === null) {
    res.json([]);
  }  
  res.json(result);
});
router.get('/:id', middleware.userExtractor, async (req, res, next) => {
  if (!req.user || !req.user._id) {
    const err = new Error('Supply valid user token');
    res.status(400);
    return next(err);
  }
  if (!req.params.id) {
    const err = new Error('Supply id of wordlist');
    res.status(400);
    return next(err);
  }
  const id = req.params.id;
  const userId = req.user._id;
  console.log("looking with id");
  console.log(id);
  
  
  const result = await wordlistModel.findById(id);
  
  if (result === null) {
    const err = new Error('Wordlist id not found');
    res.status(404);
    return next(err);
  }
  if (result.owner._id.toString() !== userId.toString()) {
    console.log(result.owner._id);
    console.log(userId);
    
    const err = new Error('No rights to that wordlist');
    res.status(401);
    return next(err);
  }
  console.log("sending wordlist successfully");
  
  res.json(result);
  
});

router.post('/create/', middleware.userExtractor,  async (req, res, next) => {
  if (!req.user) {
    const err = new Error('Supply valid user token');
    res.status(400);
    return next(err);
  }
  if (!req.body || !req.body.wordlist || !req.body.wordlist.words || !req.body.wordlist.title) {
    const err = new Error('Supply valid wordlist');
    res.status(400);
    return next(err);  
  }
  const words = req.body.wordlist.words as string[];
  const title = req.body.wordlist.title as string;
  const owner = req.user._id;
  const newWordlist = new wordlistModel({ title, words, owner });
  const savedWordlist = await newWordlist.save();
  console.log("savedwordlist:");
  
  console.log(savedWordlist);
  
  res.json(savedWordlist);
});

export default router;
