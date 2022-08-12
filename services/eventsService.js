import api from "./api"

class eventsService {

  async hasUsername(username) {
    const data = {
      username: username
    }
    return api.post('members/hasUsername', data)
  }

  async getEventAll() {
    try {
      return api.get('events?pageSize=20')
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async transferMemberData(data) {
    try {
      return api.post('members/transferMemberData', data, {
        headers: {
              'Content-Type': `multipart/form-data`,
            }
      })
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



}

export default new eventsService();
