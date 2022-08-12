import axios from "react-native-axios";

const instance = axios.create({
  baseURL: "https://api-eventloop.sit.kmutt.ac.th/sit/eventService/",
});

export default instance;
