import api from "./api"
import {re} from "@babel/core/lib/vendor/import-meta-resolve";

class eventsService {
  async getEventAll(){
    try {
      return api.get('events?pageSize=20')
    }catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async transferMemberData(mem){
    const data = {
      name : mem.name,
      profileUrl: 'https://s.isanook.com/jo/0/ui/482/2412451/69567264_948939815456101_8923681055869763584_n.jpg',
      email: mem.email,
      memberId: mem.memberId
    }
    try {
      return api.post('members/transferMemberData', data)
    }catch (e) {
      return new Promise(reject => reject(e))
    }
  }

  async registerEvent(memId, eveId){
    const data = {
      memberId : memId,
      eventId : eveId
    }
    return api.post('events/registerEvent', data)
  }

  async isRegisterEvent(memId, eveId){
    const data = {
      memberId : memId,
      eventId : eveId
    }
    return  api.post('events/isRegister', data)
  }

  async unRegisterEvent(memId, eveId){
    const data = {
      memberId : memId,
      eventId : eveId
    }
    return  api.post('events/unregisterEvent', data)
  }

  async getEventByOrganizerId(memberId){
    return api.get(`members/${memberId}/createEvent`)
  }

  async getCodeCheckIn(memId,eveId){
    const data = {
      memberId : memId,
      eventId : eveId
    }
    return api.post(`events/generateCode`, data)
  }

  async checkInByCode(memId, checkCode, eveId){

    const data = {
      memberId : memId,
      checkInCode : checkCode,
      eventId : eveId
    }
    console.log(data)
    return api.post(`events/checkIn`, data)
  }

  async isCheckIn(memId, eveId){
    const data = {
      memberId : memId,
      eventId : eveId
    }
    return api.post(`events/isCheckIn`, data)
  }

  async checkRegisterEvent (memId,eveId) {
    const data = {
      memberId : memId,
      eventId : eveId
    }
    return api.post(`events/isRegister`, data)
  }
}

export default new eventsService();
