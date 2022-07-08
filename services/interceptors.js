import axiosInstance from "./api";
import storages from "./storages";
import {refreshToken} from "../actions/auth";

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      await storages.getDataV2('user').then( res => {
        config.headers["Authorization"] = JSON.parse(res).idToken;
      });
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const { dispatch } = store;

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig.url !== "login" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          await dispatch(refreshToken())
          return await axiosInstance(originalConfig);
        }
      }
      return Promise.reject(err);
    }
  );
};
export default setup;
