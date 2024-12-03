import ApiService from './ApiService'

class CategoryService extends ApiService {
  constructor() {
    super()
    this.path = 'api/v1'
  }

  async getAllParentCategoires(limit = 10, offset = 0) {
    try {
      let res = await this.get(`${this.path}/getAll/PG`, { offset, limit })
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async getAllChildCategoires(limit = 10, offset = 0) {
    try {
      let res = await this.get(`${this.path}/getAll/CG`, { offset, limit })
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async getAllGrandChildCategoires(limit = 10, offset = 0) {
    try {
      let res = await this.get(`${this.path}/getAll/GCG`, { offset, limit })
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async addGrandChildCategory(data) {
    try {
      let res = this.post(`${this.path}/add/GCG`, data)
      return res.data
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async getCategories() {
    try {
      return await this.get(`${this.path}/category`)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

const Category = new CategoryService()
export default Category
