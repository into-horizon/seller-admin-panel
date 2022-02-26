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
    async getStore(payload) {
        try {  
            let response = await this.get(this.path, null, this.bearer(payload? payload:this.token()))
            return response.data
            
        } catch (error) {
            console.log("🚀 ~ file: Auth.js ~ line 24 ~ Auth ~ getStore ~ error", error)
            return error
        }
    }

    async logout() {
        try {
            let response = await this.post('auth/signout', null, this.bearer(this.token()))
            return response
        } catch (error) {
            return error
        }
    }
}
