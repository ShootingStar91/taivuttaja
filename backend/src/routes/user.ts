/* eslint-disable @typescript-eslint/no-misused-promises */
// Disable this for router files because the async routes are ok and necessary

import express from 'express';
import userService from '../services/user';
import { LoginResponse } from '../types';

const router = express.Router();

// /api/user/...


router.post(`/create/`, async (req, res) => {
  try {
    await userService.createUser(req.body.username, req.body.password);
    res.status(200).send();
  } catch (e) {
    res.status(400).send({ error: (e as Error).message });
  }

});

router.post(`/login/`, async (req, res) => {
  try {
    const loginResponse: LoginResponse = await userService.tryLogin(req.body.username, req.body.password);
    res.status(200).send(loginResponse);
  } catch (e) {
    res.status(400).send({ error: (e as Error).message });
  }
});


export default router;