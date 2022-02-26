import axios from 'axios';
import cookie from 'react-cookies';
import jwt from 'jsonwebtoken';
import { isJwtExpired } from 'jwt-check-expiration';
let api = process.env.REACT_APP_API;

export default class ApiService {
  
    async get(endpoint, params, headers) {
     let res = await axios({
            method: 'get',
            url: `${api}/${endpoint}`,
            params:params,
            headers: headers
          })
        
          return res.data
    }
    async post(endpoint,data,header,params = null){
     let res = await axios({
            method: 'post',
            url: `${api}/${endpoint}`,
            data: data,
            headers: header,
            params:params,
            
          });
          return res.data
    }
  
    async update(endpoint,data,header,params=null){
        let res = await axios({
            method: 'put',
            url: `${api}/${endpoint}`,
            params:params,
            data: data,
           headers: header
          });
          return res.data
    }

    async delete(endpoint,params ){
        let res = await axios({
            method: 'delete',
            url: `${api}/${endpoint}`,
            params:params
           
          });
          return res.data
    }

    bearer(token) {
      return { Authorization: ` Bearer ${token}` }
    }

    basic(data) {
     return  { Authorization: ` Basic ${btoa(`${data.email}:${data.password}`)}` }
    } 
     token(payload){
      let token =  payload || cookie.load('access_token')
      // console.log("🚀 ~ file: ApiService.js ~ line 61 ~ ApiService ~ token ~ token", token)
      // console.log('check', isJwtExpired(token))
      let decoded = jwt.verify(token, process.env.REACT_APP_SECRET)
      console.log("🚀 ~ file: ApiService.js ~ line 65 ~ ApiService ~ token ~ !isJwtExpired(token)", isJwtExpired(token))
      if(!isJwtExpired(token)) return token 
      else return cookie.load('refresh_token')
    }
    // token(){
    //   return 
    // }

}

