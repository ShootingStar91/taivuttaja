/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import jwt, { JsonWebTokenError, Secret } from 'jsonwebtoken';
import { SECRET } from './config';
import { userModel, User } from './models/User';
import { MongoServerError } from 'mongodb';

/*
  This allows extractors to add user and token to request
*/
declare module 'express-serve-static-core' {
  interface Request {
    token?: string | null,
    user: User,
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
    throw new JsonWebTokenError('Invalid token');
  }

  jwt.verify(request.token, SECRET as Secret, (_err, decoded) => {
    if (!decoded) {
      throw new JsonWebTokenError('Token has expired');
    }
    const id = (decoded as TokenInterface).id;
    
    userModel.findById(id).then(user => {
      if (user) {
        request.user = user;
        return next();
      } else {
        throw new JsonWebTokenError('Invalid token');
      }
    }).catch(_e => response.status(401).json({ message: 'User does not exist anymore' }));
    return;
  });
  return;
};

const errorHandler = (err: Error, _req: express.Request, res: express.Response, _next: Next) => {
  console.log('Error: ', err.message);
  
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'Invalid id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({ message: 'Login invalid or expired. Please try to login again' });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).send({ message: 'Login expired' });
  } else if (err.name === 'MongoServerError') {
    const mongoError = err as MongoServerError;
    if (mongoError.code === 11000) {
      return res.status(400).send({ message: 'Username already exists' });
    }
    return res.status(400).send({ message: 'Error in database' });
  }

  return res.status(400).send({ message: err.message });

};

const unknownEndpoint = (_req: express.Request, res: express.Response) => {
  res.status(404).send({ error: 'Unknown endpoint' });
};

export default {
  logger, tokenExtractor, userExtractor, errorHandler, unknownEndpoint
};