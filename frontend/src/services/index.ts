import axios from "axios";
import { errorToast } from "../reducers/toastApi";

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.log(error);
    const status = error.response?.status as number;
    if (status === 401) {
      // notice: will logout on ANY forbidden-error
      window.localStorage.clear();
      window.location.href = "/login";
      return;
    }
    if (error.response) {
      let errorMsg = error.response.data.message as string;
      if (errorMsg === "") {
        errorMsg = "Unknown error occurred";
      }
      errorToast(errorMsg);
    } else if (error.request) {
      errorToast("Could not receive response from server");
    }
  }
);

export default axios;
