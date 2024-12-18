import ApiService from './ApiService'

class ProductService extends ApiService {
  constructor() {
    super()
    this.path = 'api/v1/product'
  }

  async addProduct(data) {
    try {
      let res = await this.post(`${this.path}`, data, {
        'Content-Type': 'multipart/form-data',
      })
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async getProductsByStatus(data) {
    try {
      let res = await this.get(
        `${this.path}/store/${data.status}`,
        this.getLimitOffsetFromParams(data),
      )
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async addProductPicture(data) {
    try {
      let res = await this.post(`${this.path}/picture`, data, {
        'Content-Type': 'multipart/form-data',
      })
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async deleteProductPicture(data) {
    try {
      let res = await this.delete(`${this.path}/picture`, data)
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateSizeAndQuantity(data) {
    try {
      let res = await this.put(`${this.path}/quantityandsize`, data)
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async updateDiscount(data) {
    try {
      let res = await this.put(`${this.path}/discount`, data)
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async getSearchData(data) {
    try {
      let res = await this.get(`${this.path}/searchData/${JSON.stringify(data)}`, null)
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async getProduct(data) {
    try {
      let res = await this.get(`${this.path}/${data}`)
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async updateProduct(data) {
    try {
      let res = await this.put(`${this.path}`, data)
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async deleteProduct(data) {
    try {
      let res = await this.delete(`${this.path}`, { id: data })
      return res
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

let Product = new ProductService()
export default Product
