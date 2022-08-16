
export const getHeader = (token: string) => {
  return { headers: { Authorization: "bearer " + token } };
};

export const delay = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
