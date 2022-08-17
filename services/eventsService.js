import api from "./api"

class eventsService {

  async hasUsername(username) {
    const data = {
      username: username
    }
    return api.post('members/hasUsername', data)
  }

  async getAllEvent() {
    try {
      return api.get('events?pageSize=20')
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async getEventByTag(selectTag = []) {
    let tags = selectTag.map((item) => `&tags=${item}`).join('')

    console.log('events/getEventByTag?tags=INT210' + tags + '&pageSize=3&pageNo=0&sortBy=startDate&orderBy=desc')
    try {
      return api.get('events/getEventByTag?tags=INT210' + tags + '&pageSize=20&pageNo=0&sortBy=startDate&orderBy=desc')
    } catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async getEventByAttention(pageNo = 0, pageSize = 20) {
    try {
      return api.get('events/attention?pageNo=' + pageNo + '&pageSize=' + pageSize)
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



  async transferMemberData(mem) {
    const data = {
      name: mem.name,
      profileUrl: 'https://s.isanook.com/jo/0/ui/482/2412451/69567264_948939815456101_8923681055869763584_n.jpg',
      email: mem.email,
      memberId: mem.memberId
    }
    try {
      return api.post('members/transferMemberData', data)
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
