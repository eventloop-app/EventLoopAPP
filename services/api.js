import axios from "react-native-axios";

const instance = axios.create({
  baseURL: "https://api-eventloop.sit.kmutt.ac.th/dev/eventService/",
});

export default instance;
