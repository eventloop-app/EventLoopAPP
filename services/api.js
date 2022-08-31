import axios from "react-native-axios";
import config from "../getEnv";

const instance = axios.create({
  baseURL: config.APP_API,
});

export default instance;
