const { default: ApiService } = require("./ApiService");

class Notifications extends ApiService {
  constructor() {
    super();
    this.url = "api/v1/notifications";
  }
  async getNotifications(params) {
    try {
      return await this.get(this.url, params);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateNotifications(id) {
    try {
      return await this.update(this.url, { id });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new Notifications()
