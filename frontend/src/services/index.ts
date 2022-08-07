import axios from "axios";

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const status = error.response?.status as number;

    if (status === 401) {
      // notice: will logout on ANY unauthorized error
      window.localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
