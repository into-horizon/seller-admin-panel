import ApiService from "./ApiService";


class ProductService extends ApiService{
    constructor(){
        super();
        this.path = "api/v1/product";
    }

    async addProduct(data){
        try { 
            let res = await this.post(`${this.path}`, data,  {'Content-Type': 'multipart/form-data', ...this.bearer( await this.token())}); 
            return res;
        } catch (error) {
            throw new Error(error.message); 
        }
    }
    async getProductsByStatus(data){
        try {
            let res = await this.get(`${this.path}/store/${data.status}?limit=${data.limit}&offset=${data.offset}`, null, this.bearer( await this.token()))
            return res
        } catch (error) {
            throw new Error(error.message); 
        }
    }

    async addProductPicture(data){
        try {
            let res = await this.post(`${this.path}/picture`, data,  {'Content-Type': 'multipart/form-data', ...this.bearer( await this.token())})
            return res
        } catch (error) {
            throw new Error(error.message); 
        }
    }
    async deleteProductPicture(data){
        try {
            let res = await this.delete(`${this.path}/picture`, data,  this.bearer( await this.token()))
            return res
        } catch (error) {
            throw new Error(error.message); 
        }
    }
    async getAllProducts(endpoint = 'list', limit = 10, offset= 0){
       
        try { 
            let res = await this.get(`${this.path}/${endpoint}`, {offset: offset, limit:limit}); 
            return res.data;
        } catch (error) {
            throw new Error(error.message); 
        }
    }

    async getProduct(endpoint =null , id){
        try { 
            let res = await this.get(`${this.path}/${id}/${endpoint}`);  
            return res;
        } catch (error) {
            throw new Error(error.message); 
        }
    }
    async deleteProduct(id){
        try { 
            let res = await this.delete(`${this.path}/${id}`); 
            return res.data;
        } catch (error) {
            throw new Error(error.message); 
        }
    }
    async updateProduct(data){
        try { 
            let res = await this.update(`${this.path}`, data); 
            return res.data;
        } catch (error) {
            throw new Error(error.message); 
        }
    }
  
}

let Product = new ProductService();
export default Product;