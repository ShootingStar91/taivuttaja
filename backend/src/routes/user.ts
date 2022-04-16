/* eslint-disable @typescript-eslint/no-misused-promises */
// Disable this for router files because the async routes are ok and necessary
require('express-async-errors');

import express from 'express';
import userService from '../services/user';
import { LoginResponse } from '../types';
import middleware from '../middleware';

const router = express.Router();

// /api/user/...


router.post(`/create/`, async (req, res) => {
  await userService.createUser(req.body.username, req.body.password);
  res.status(200).send();
});

router.post(`/login/`, async (req, res) => {
  const loginResponse: LoginResponse = await userService.tryLogin(req.body.username, req.body.password);
  res.status(200).send(loginResponse);
});

router.post('/deleteuser/', middleware.userExtractor, async (req, res) => {
  await userService.deleteUser(req.user);
  res.status(200).send();
});

export default router;