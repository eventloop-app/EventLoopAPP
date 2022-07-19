import axiosInstance from "./api";
import storages from "./storages";
import {refreshToken} from "../actions/auth";

const setup = (store) => {
  axiosInstance.interceptors.request.use(async (config) => {
    await storages.getDataV2('user').then(res => {
      if (res !== undefined) {
        config.headers["Authorization"] = JSON.parse(res).idToken;
        config.headers["content-type"] = 'application/json';
      }
    });
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  const {dispatch} = store;

  axiosInstance.interceptors.response.use((res) => {
    return res;
  }, async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "login" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry && err.response.data.message !== 'JWT not present.') {
        console.log('Token Exprice')
        originalConfig._retry = true;
        await dispatch(refreshToken())
        await storages.getDataV2('user').then(res => {
          originalConfig.headers.Authorization = JSON.parse(res).idToken
        })
        return await axiosInstance(originalConfig);
      }
    }
    return Promise.reject({message: 'มีบางอย่างผิดพลาด' + err.response.status});
  });
};
export default setup;
