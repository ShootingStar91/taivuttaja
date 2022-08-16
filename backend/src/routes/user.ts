/* eslint-disable @typescript-eslint/no-misused-promises */
// Disable this for router files because the async routes are ok and necessary
require('express-async-errors');

import express from 'express';
import userService from '../services/user';
import middleware from '../middleware';

const router = express.Router();

// /api/user/...


router.post(`/create/`, async (req, res) => {
  const result = await userService.createUser(req.body.username, req.body.password);
  res.status(200).send(result);
});

router.post(`/login/`, async (req, res) => {
  const user = await userService.tryLogin(req.body.username, req.body.password);
  res.status(200).send(user);
});

router.post('/deleteuser/', middleware.userExtractor, async (req, res) => {
  const result = await userService.deleteUser(req.user);
  res.status(200).send(result);
});

router.post('/doneword/', middleware.userExtractor, async (req, res) => {
  const result = await userService.addDoneWord(req.body.wordId, req.user);
  res.status(200).send(result);
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
  const result = await userService.changePassword(req.body.currentPassword, req.body.newPassword, req.user);  
  res.status(200).send(result);
});

router.post('/setstrictaccents/', middleware.userExtractor, async (req, res) => {
  const result = await userService.setStrictAccents(req.body.strictAccents, req.user);
  res.status(200).send(result);
});

export default router;