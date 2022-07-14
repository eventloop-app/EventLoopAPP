import axios from "react-native-axios";

const instance = axios.create({
  baseURL: "https://apim-eventloop-prod-sea.azure-api.net",
});

export default instance;
