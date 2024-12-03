import ApiService from './ApiService'

export default class Update extends ApiService {
  constructor() {
    super()
    this.path = 'api/v1/store'
  }

  async updateInfo(info) {
    try {
      let response = await this.put(this.path, info)
      return response
    } catch (error) {
      return error
    }
  }
  async updateStoreName(name) {
    try {
      let response = await this.put(`${this.path}/name`, name)
      return response
    } catch (error) {
      return error
    }
  }

  async updateStorePicture(data) {
    try {
      let response = await this.put(`${this.path}/picture`, data, {
        'Content-Type': 'multipart/form-data',
      })
      return response
    } catch (error) {
      return error
    }
  }
}
