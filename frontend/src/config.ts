export const NOTIFICATION_DELAY = 6000;

export const ERRORS = {
  INVALID_LOGIN: 'Invalid user. Please try to login again',
};

export const COLORS = {
  WRONG: '#ffebeb',
  CORRECT: '#9fc99f',
  BLANK: '#ffffff',
  ALMOST_CORRECT: '#e2ff8a',
  BLOCKED: '#878787',
  SHOWANSWER: '#ffec99'

};

export const baseUrl = process.env.REACT_APP_BACKEND || 'http://localhost:3001/api/';
