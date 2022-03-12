import { createSlice } from "@reduxjs/toolkit";
import cookie from 'react-cookies';

import Product from '../services/ProductService';


const products = createSlice({
    name: 'products',
    initialState : {message: '', product: [], currentProducts: {count: 0, products: []}},
    reducers: {
        addProduct(state, action){
            return {...state, message: action.payload.message, products: [...state.product, action.payload.result]}
        },
        errorMessage (state,action){
            return {...state, message: action.payload.message}
        },
        getProducts (state, action){
            return {...state, message: action.payload.message, currentProducts: {count: action.payload.result.count, products: action.payload.result.result}}
        },
        addProductPicture(state, action){
            return {...state, message: action.payload.message, currentProducts: {...state.currentProducts, products:action.payload.result}}
        }, 
        deleteProductPicture(state, action){
            return {...state, message: action.payload.message, currentProducts: {...state.currentProducts, products:action.payload.result}}
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

export const getProductsByStatusHandler = payload => async (dispatch, state) => {
    try {
        let result = await Product.getProductsByStatus(payload)
        if (result.status === 200){
            dispatch(getProducts({message: 'success', result: result}))
        } else {
            dispatch(errorMessage(() =>{return{message: result.message}}))
        }
    } catch (error) {
        dispatch(errorMessage(() =>{return{message: 'something went wrong'}}))
    }
}

export const addProductPictureHandler = payload => async (dispatch, state) => {
    try {
        let result = await Product.addProductPicture(payload)
        let x = state().products
        if(result.status === 200){
            let y = {...x}
            let newState = y.currentProducts.products.map(product =>{
                if(result.data.product_id === product.id){
                    let newProduct = {...product}
                    let newPic = {id: result.data.id, product_picture: result.data.product_picture}
                    newProduct['pictures'] = [...product.pictures, newPic]
                    return newProduct
                } else return product
                
            })
            dispatch(addProductPicture({message: 'success', result: newState}))
        } else{
            dispatch(errorMessage({message: result}))
        }
    } catch (error) {
         dispatch(errorMessage(() =>{return{message: 'something went wrong'}}))
    }
}
export const deleteProductPictureHandler = payload => async (dispatch, state) =>{
    try {
        let result = await Product.deleteProductPicture(payload)
        let x = state().products
        if(result){
            let y = {...x}
            let newState = y.currentProducts.products.map(product =>{
                let newProduct = {...product}
                 let newPics = product.pictures.filter(picture => picture.id !== payload.picture_id)
                 newProduct['pictures'] = newPics
                 return newProduct
            })
            dispatch(deleteProductPicture({message: 'success', result: newState}))
        } else{
            dispatch(errorMessage({message: result}))
        }
    } catch (error) {
        dispatch(errorMessage(() =>{return{message: error.message}}))
    }
}
export default products.reducer
export const {addProduct,errorMessage,getProducts,addProductPicture,deleteProductPicture} = products.actions