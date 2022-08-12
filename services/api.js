import axios from "react-native-axios";
import {APP_API} from '@env'

const instance = axios.create({
  baseURL: APP_API,
});

export default instance;
