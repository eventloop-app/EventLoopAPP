import api from "./api"
import config from "../getEnv";
import axios from "react-native-axios";
class eventsService {

  async hasUsername(username) {
    const data = {
      username: username
    }
    return api.post('members/hasUsername', data)
  }

  async getAllEvent() {
    try {
      return api.get('events?pageSize=10')
    } catch (e) {
      console.log("catch")
      return new Promise(reject => reject(e))
    }
  }

  async getEventByTag(selectTag = []) {
    const tags = selectTag.map((item) => `&tags=${item}`).join('')
    try {
      return api.get(`events/getEventByTag?tags=INT210${tags}&pageSize=20&pageNo=0&sortBy=startDate&orderBy=desc`)
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async getEventByAttention(pageNo = 0, pageSize = 20) {
    try {
      return api.get(`events/attention?pageNo=${pageNo}&pageSize=${pageSize}`)
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }


  async getAllRegisteredEvent() {
    try {
      return api.get('members/82c85d89-570d-4630-a463-7d1e3247dfc6/registerEvent?pageSize=1&pageNo=0')
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async transferMemberData(data) {
    // axios({
    //   method: "post",
    //   url: "myurl",
    //   data: bodyFormData,
    //   headers: { "Content-Type": "multipart/form-data" },
    // })
    try {
      return axios({
        method: "post",
        url: `${config.APP_API}members/transferMemberData`,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      })
      // return api.post('members/transferMemberData', data)
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async registerEvent(memId, eveId) {
    const data = {
      memberId: memId,
      eventId: eveId
    }
    return api.post('events/registerEvent', data)
  }

  async isRegisterEvent(memId, eveId) {
    const data = {
      memberId: memId,
      eventId: eveId
    }
    return api.post('events/isRegister', data)
  }

  async unRegisterEvent(memId, eveId) {
    const data = {
      memberId: memId,
      eventId: eveId
    }
    return api.post('events/unregisterEvent', data)
  }

  async getEventByOrganizerId(memberId) {
    return api.get(`members/${memberId}/createEvent`)
  }

  async getCodeCheckIn(memId, eveId) {
    const data = {
      memberId: memId,
      eventId: eveId
    }
    return api.post(`events/generateCode`, data)
  }

  async checkInByCode(memId, checkCode, eveId) {

    const data = {
      memberId: memId,
      checkInCode: checkCode,
      eventId: eveId
    }
    console.log(data)
    return api.post(`events/checkIn`, data)
  }

  async isCheckIn(memId, eveId) {
    const data = {
      memberId: memId,
      eventId: eveId
    }
    return api.post(`events/isCheckIn`, data)
  }

  async checkRegisterEvent(memId, eveId) {
    const data = {
      memberId: memId,
      eventId: eveId
    }
    return api.post(`events/isRegister`, data)
  }

  async checkEmail(email) {
    const data = {
      email: email,
    }
    return api.post(`members/hasEmail`, data)
  }

  async createEvent(data){
    return axios({
      method: "post",
      url: `${config.APP_API}events/createEvent`,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    })
    // return api.post(`events/createEvent`, data)
  }

  async getEventById(id){
    return api.get(`events/${id}` )
  }
}

export default new eventsService();
