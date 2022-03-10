import express from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    token?: string | null
  }
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

export default exports = {
  logger, tokenExtractor
};