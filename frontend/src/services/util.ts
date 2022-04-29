/* eslint-disable @typescript-eslint/no-explicit-any */

export const getHeader = (token: string) => {
  return { headers: { Authorization: 'bearer ' + token } };
};

export const success = <T>(item: T): [string, T | undefined] => {
  return ["", item];
};

export const error = (e: any): [string, undefined] => {
  return [e.response.data.message as string, undefined];
};

export const customError = (message: string): [string, undefined] => {
  return [message, undefined];
};

export const delay = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
};