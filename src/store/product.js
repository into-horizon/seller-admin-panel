import { createSlice } from "@reduxjs/toolkit";
import cookie from 'react-cookies';

import Product from '../services/ProductService';


const products = createSlice({
    name: 'products',
    initialState : {message: '', products: []},
    reducers: {
        addProduct(state, action){
            return {...state, message: action.payload.message, products: [...state.products, action.payload.result]}
        },
        errorMessage (state,action){
            return {...state, message: action.payload.message}
        }
    }
})

export const addProductHandler = payload => async (dispatch, state) => {
    try {
       let result = await Product.addProduct(payload)
       if(result.status === 201){
           dispatch(addProduct(result))
       } else{
        dispatch(errorMessage({message: result}))
       }
    } catch (error) {
        dispatch(errorMessage(() =>{return{message: 'something went wrong'}}))
    }
}
export default products.reducer
export const {addProduct,errorMessage} = products.actions