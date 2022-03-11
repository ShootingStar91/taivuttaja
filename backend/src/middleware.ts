/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { SECRET } from './config';
import { userModel, User } from './models/User';
declare module 'express-serve-static-core' {
  interface Request {
    token?: string | null,
    user?: User,
  }
}

interface TokenInterface {
    id: string,
    username: string
}

type Next = () => void | Promise<void>;

const logger = (request: express.Request, _response: express.Response, next: Next) => {
  console.log(`${request.method}: ${request.path}`);
  if (request.method === 'POST') {
    console.log(request.body);
  }
  void next();
};

const tokenExtractor = (request: express.Request, _response: express.Response, next: Next) => {
  const authorization = request.get('authorization');
    request.token = (authorization && authorization.toLowerCase().startsWith('bearer '))
    ? authorization.substring(7)
    : null;
  
  void next();
  
};

const userExtractor = (request: express.Request, response: express.Response, next: Next) => {
  if (request.token === undefined || request.token === null) {
    return response.status(401).json({ error: 'Invalid or missing token' });
  }

  jwt.verify(request.token, SECRET as Secret, (_err, decoded) => {
    console.log("decoded token from verify callback");
    if (!decoded) {
      console.log("decoded token invalid");
      return response.status(401).json( { error: 'Invalid token'});
    }
    console.log(decoded);
    const id = (decoded as TokenInterface).id;
    
    userModel.findById(id).then(user => {
      if (user) {
        request.user = user;
        return next();
      } else {
        return response.status(401).json({ error: 'Invalid token' });
      }
      }).catch(e => console.log(e));
    return;
  });
  return;
};

export default exports = {
  logger, tokenExtractor, userExtractor
};