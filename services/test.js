import api from "./api"
import axios from "react-native-axios";
import header from "react-native/Libraries/NewAppScreen/components/Header";
import storages from "./storages";
class test {

  async checkAPI(){
    try {
      let idToken = ""
      await storages.getDataV2("user").then(res =>{
        idToken = JSON.parse(res).idToken
      })
      return api.get('/events')
    }catch (e) {
      return new Promise(reject => reject(e))
    }

  }

}

export default new test();
