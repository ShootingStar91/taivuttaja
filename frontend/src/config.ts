export const NOTIFICATION_DELAY = 6000;
export const ERRORS = {
  INVALID_LOGIN: "Invalid user. Please try to login again",
};
export const COLORS = {
  WRONG: "#ffebeb",
  CORRECT: "#45bd13",
  BLANK: "#ffffff",
  ALMOST_CORRECT: "#e2ff8a",

};
export const baseUrl = process.env.TAIVUTTAJA_BACKEND === 'local' ? 'http://localhost:3001/api/' : 'http://16.16.67.83:3001/api/';
