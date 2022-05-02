import axios from "axios";

const interceptorEnv = {
  refresh: false,
};

const defaultBaseUrl = process.env.REACT_APP_API_BASE_URL ?? "http://localhost:3000/";

axios.defaults.baseURL =  defaultBaseUrl;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (onFulfilled) => onFulfilled,
  async (onRejected) => {
    if (onRejected.response.status === 401 && !interceptorEnv.refresh) {
      interceptorEnv.refresh = true;
      const { status } = await axios.post(`auth/refresh`, {});

      if (status === 200) {
        return axios(onRejected.config);
      }
    }

    interceptorEnv.refresh = true;
    return onRejected;
  }
);