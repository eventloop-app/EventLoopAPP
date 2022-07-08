import api from "./api"

class eventsService {
  async getEventAll(){
    try {
      return api.get('/events')
    }catch (e) {
      return new Promise(reject => reject(e))
    }
  }
}

export default new eventsService();
