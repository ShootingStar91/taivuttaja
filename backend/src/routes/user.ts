import express from 'express';
import { userModel, User } from '../models/User';
const router = express.Router();

// /api/user/...



router.get(`/`, (_req, res) => {
  res.send('hello user');
});

router.post(`/login/`, (req, res) => {
  if (req.body.username && req.body.password) {
    const username = req.body.username as string;
    const password = req.body.password as string;
    userModel.findOne( { username, password })
      .then((result: User | null) => {
        if (result === null) {
          res.send('No user found');
        } else {
          res.send(result);
        }
      }
      )
      .catch((e) => res.send(e));
  } else {
    res.send('Requiring username and password');
  }
});

export default router;