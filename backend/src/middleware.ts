import express from 'express';

type Next = () => void | Promise<void>;

const logger = (request: express.Request, _response: express.Response, next: Next) => {
  console.log(`${request.method}: ${request.path}`);
  if (request.method === 'POST') {
    console.log(request.body);
  }
  void next();
};

export default exports = {
  logger
};