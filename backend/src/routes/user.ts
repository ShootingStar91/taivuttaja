/* eslint-disable @typescript-eslint/no-misused-promises */
// Disable this for router files because the async routes are ok and necessary
require('express-async-errors');

import express from 'express';
import userService from '../services/user';
import middleware from '../middleware';

const router = express.Router();

// /api/user/...


router.post(`/create/`, async (req, res) => {
  await userService.createUser(req.body.username, req.body.password);
  res.status(200).send();
});

router.post(`/login/`, async (req, res) => {
  const user = await userService.tryLogin(req.body.username, req.body.password);
  console.log("USER:" , user);
  
  res.status(200).send(user);
});

router.post('/deleteuser/', middleware.userExtractor, async (req, res) => {
  await userService.deleteUser(req.user);
  res.status(200).send();
});

router.post('/doneword/', middleware.userExtractor, async (req, res) => {
  await userService.addDoneWord(req.body.wordId, req.user);
  res.status(200).send();
});

router.get('/donewords/', middleware.userExtractor, async (req, res) => {
  const result = await userService.getDoneWords(req.user);
  res.status(200).send(result);
});

router.post('/goal/', middleware.userExtractor, async (req, res) => {
  const result = await userService.setGoal(req.body.goal, req.user);
  res.status(200).send(result);
});

router.post('/changepassword/', middleware.userExtractor, async (req, res) => {
  const result = await userService.changePassword(req.body.password, req.user);
  res.status(200).send(result);
});

router.post('/relog/', middleware.userExtractor, (req, res) => {
  const result = userService.relog(req.user);
  res.status(200).send(result);
});

export default router;