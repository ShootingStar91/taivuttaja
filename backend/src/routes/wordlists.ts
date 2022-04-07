/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import middleware from '../middleware';
import wordlistService from '../services/wordlists';
require('express-async-errors');

const router = express.Router();


router.post('/deleteword/', middleware.userExtractor, async (req, res) => {
  if (!req.user) {
    res.status(400).send({ error: "User not found" });
    return;
  }

  await wordlistService.deleteWord(req.body.word, req.body.wordlistId, req.user._id);
  res.status(200).send();

});

router.post('/addword/', middleware.userExtractor, async (req, res) => {
  if (!req.user) {
    res.status(400).send({ error: "User not found" });
    return;
  }

  const result = await wordlistService.addWord(req.body.word, req.body.wordlistId, req.user._id);
  if (!result) {
    throw new Error("Error adding word to wordlist");
  }
  res.send(result);
  

});

router.get('/', middleware.userExtractor, async (req, res) => {
  // Returns all owners wordlists
  if (!req.user) {
    res.status(400).send({ error: "User not found" });
    return;
  }

  const result = await wordlistService.getUsersLists(req.user._id);
  res.json(result);

});


router.get('/:id', middleware.userExtractor, async (req, res) => {
  if (!req.user) {
    res.status(400).send({ error: "User not found" });
    return;
  }

  const result = await wordlistService.getList(req.params.id, req.user._id);
  res.json(result);

});

router.post('/create/', middleware.userExtractor, async (req, res) => {
  if (!req.user) {
    res.status(400).send({ error: "User not found" });
    return;
  }

  await wordlistService.create(req.body.name, req.user._id);
  res.status(200).send();

});

export default router;
