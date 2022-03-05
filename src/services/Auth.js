import ApiService from "./ApiService";

export default class Auth extends ApiService{
    constructor(){
        super();
        this.path = "api/v1/store";
    }

    async basicAuth (data){
        try {
            let response = await this.post(`${this.path}/signin`, null, this.basic(data))
            return response
        } catch (error) {
            return error;
        }
    }
    async getStore() {
        try {  
            // console.log("🚀 ~ file: Auth.js ~ line 18 ~ Auth ~ getStore ~ payload", payload)
            let response = await this.get(this.path, null, this.bearer(await this.token()))
            return response.data
            
        } catch (error) {
            return error
        }
    }

    async logout() {
        try {
            let response = await this.post('auth/signout', null, this.bearer( await this.token()))
            return response
        } catch (error) {
            return error
        }
    }
}
