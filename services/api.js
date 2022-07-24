import axios from "react-native-axios";

const instance = axios.create({
  baseURL: "https://dev-eventloop.wavemoroc.app/eventService/",
});

export default instance;
