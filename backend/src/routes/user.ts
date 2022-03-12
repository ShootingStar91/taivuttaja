/* eslint-disable @typescript-eslint/no-misused-promises */
// Disable this for router files because the async routes are ok and necessary

import express from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { userModel } from '../models/User';
import { SECRET } from '../config';
const router = express.Router();

// /api/user/...



router.get(`/`, (_req, res) => {
  res.send('hello user');
});

router.post(`/create/`, async (req, res) => {
  if (req.body.username && req.body.password) {
    const username = req.body.username as string;
    const password = req.body.password as string;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, password: passwordHash });
    const savedUser = await newUser.save();
    if (savedUser) {
      res.json(savedUser);
    } else {
      res.json({ error: 'error creating user' });
    }
  } else {
    res.status(400).send('username & password required');
  }
});

router.post(`/login/`, async (req, res) => {
  if (req.body.username && req.body.password) {
    const username = req.body.username as string;
    const password = req.body.password as string;
    const user = await userModel.findOne( { username });
    if (user !== null) {
      bcrypt.compare(password, user.password, (_err, result) => {
        if (result) {
          const userForToken = { username: user.username, id: user._id };
          const token = jwt.sign(userForToken, SECRET as Secret, { expiresIn: 60 * 60 });
          res.status(200).json({ token, user: userForToken });
        } else {
          res.status(400).json( { error: 'Wrong password '});
        }
      });
    } else {
      res.status(400).json({ error: 'User not found' });
    }
  } else {
    res.status(400).json({ error: 'Login requires both username and password' });
  }
});


export default router;