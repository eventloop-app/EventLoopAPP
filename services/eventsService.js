import api from "./api"

class eventsService {
  async getEventAll(){
    try {
      return api.get('/events')
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
      return api.post('/members/transferMemberData', data)
    }catch (e) {
      return new Promise(reject => reject(e))
    }
  }
}

export default new eventsService();
