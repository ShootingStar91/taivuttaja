export const getHeader = (token: string) => {
  return { headers: { Authorization: 'bearer ' + token}};
};