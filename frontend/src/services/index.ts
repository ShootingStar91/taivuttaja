import axios from 'axios';

axios.interceptors.response.use((res) => {
  
  console.log({res});
  
  return res;
}, (error) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  console.log({error});
  
  const status = error.response?.status as number;
  if (status === 401) {
    window.localStorage.clear();
    location.replace('http://' + window.location.host + '/');
  }
});

export default axios;
