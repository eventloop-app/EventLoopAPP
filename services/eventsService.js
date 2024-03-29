import api from "./api"
import axios from "react-native-axios";
import config from "../getEnv";
class eventsService {

  async hasUsername(username) {
    const data = {
      username: username
    }
    return api.post('members/hasUsername', data)
  }

  async getAllEvent() {
    try {
      return api.get('events?pageSize=200')
    } catch (e) {
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

  async getEventByAttention(pageNo = 0) {
    try {
      return api.get(`events/attention?pageNo=${pageNo}&pageSize=10`)
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async getAllRegisteredEvent(memId) {
    try {
      return api.get(`members/${memId}/registerEvent`)
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async transferMemberData(data) {
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

  async createEvent(data) {
    return axios({
      method: "post",
      url: `${config.APP_API}events/createEvent`,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    })
    // return api.post(`events/createEvent`, data)
  }

  async getEventById(id) {
    return api.get(`events/${id}`)
  }

  async getMemberRegistedEvent(id, eveId){
    const data = {eventId: eveId, memberId : id  }
    return api.post(`events/getRegisterMember`, data)
  }

  async getEventBySearch(keyword, pageNo = 0) {
    try {
      return api.get(`events/getEventByKeyword?keyword=${keyword}&pageNo=${pageNo}&pageSize=10&sortBy=createAt&orderBy=desc`)
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async feedbackEvent(memId, eveId, scr, fb) {
    try {
      const data = {
        eventId: eveId,
        memberId: memId,
        score: parseInt(scr),
        feedback: fb
      }
      return api.post(`events/submitFeedback`,data)
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async isReviewEvent(memId, eveId) {
    try {
      const data = {
        eventId: eveId,
        memberId: memId,
      }
      return api.post(`events/isReview`,data)
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async upDateEvent(data) {
    return axios({
      method: "put",
      url: `${config.APP_API}events/editEvent`,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    })
  }

  async removeEvent(memId, eveId) {
    try {
      const data = {
        eventId: eveId,
        memberId: memId,
      }
      console.log(data)
      return axios({
        method: "delete",
        url: `${config.APP_API}events/deleteEvent`,
        data: data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async upDateProfile(data) {
    return axios({
      method: "put",
      url: `${config.APP_API}members/updateProfile`,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    })
  }

  async getEventByRange(item) {
    console.log(item.latitude, item.longitude)
    try {
      return api.get(`events/range?latitude=${item.latitude}&longitude=${item.longitude}&range=5`)
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }
}

export default new eventsService();
