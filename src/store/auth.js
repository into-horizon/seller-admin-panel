import { createSlice } from "@reduxjs/toolkit";
import cookie from 'react-cookies';
import Auth from "../services/Auth"
import Update from "src/services/Update";
const NewAuth = new Auth();
const NewUpdate = new Update();


const login = createSlice({
    name: 'login',
    initialState: {loggedIn: false, user: {}, message: ''},
    reducers: {
        loginAction(state, action) {
            let access_token;
            let refresh_token;
            if(action.payload.loggedIn === true) {
                access_token = cookie.load('access_token') || action.payload.user.access_token || null
                refresh_token = cookie.load('refresh_token') || action.payload.user.refresh_token || null
            }
            if(access_token && refresh_token){
                cookie.save('access_token', access_token)
                cookie.save('refresh_token', refresh_token)
            }
            return {...state, ...action.payload}
        },

        deleteMessage(state,action){
            return {...state, message: ''}
        }
    },
})

export const loginHandler = payload => async dispatch => {
    try {
        let response = await NewAuth.basicAuth(payload)
        if(response.status === 200) {
            let user = await NewAuth.getStore(response.access_token)
            dispatch(loginAction({loggedIn: true, user: {...response, ...user}}));
        } else{
            dispatch(loginAction({message: response.message}));
        }
    } catch (err) {
       dispatch(loginAction({message: 'you are not a seller'}));
    }
}
export const getUser = (payload) => async (dispatch) =>{
    try {
        let user = await NewAuth.getStore(payload)
        if(user.id){
            dispatch(loginAction({loggedIn: true, user: {...user}}))
        }
    } catch (error) {
    console.log("🚀 ~ file: auth.js ~ line 51 ~ error", error)   
    }

}

export const logout = (token) => async dispatch =>{
    cookie.remove('access_token')
    cookie.remove('refresh_token')
    dispatch(loginAction({logged: false, user: {}}))
    await NewAuth.logout(token)
}

export const updateInfo = info => async (dispatch, state) => {
    try {
        let response = await NewUpdate.updateInfo(info)
        console.log(state( ))
        dispatch(loginAction({user: {...state().login.user, ...response.data}}))
        
    } catch (error) {
    console.log("🚀 ~ file: auth.js ~ line 65 ~ error", error)
        
    }
}

export const updateName = name => async (dispatch, state) => {
    try {
        let response = await NewUpdate.updateStoreName({store_name:name})
        dispatch(loginAction({user: {...state().login.user, ...response.data}}))
    } catch (error) {
    console.log("🚀 ~ file: auth.js ~ line 77 ~ error", error)
        
    }
}

export const updateStorePicture = data => async (dispatch,state) => {
    try {
        let response = await NewUpdate.updateStorePicture(data);
        dispatch(loginAction({user: {...state().login.user, store_picture: response.result.store_picture}}))
    } catch (error) {
    console.log("🚀 ~ file: auth.js ~ line 88 ~ updateStorePicture ~ error", error)
        
    }
}

export default login.reducer
export const {loginAction, deleteMessage} = login.actions


