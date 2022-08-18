import { createSlice } from "@reduxjs/toolkit";

import Orders from '../services/Orders'

const orders = createSlice({
    name: 'orders',
    initialState: {pendingOrders: {orders: [], count: 0 } , ordersOverview:{orders: [], count: 0} , messages:''},
    reducers: {
        addPendingOrders(state, action) {
            return { ...state, pendingOrders: action.payload }
        },
        errorMessage(state, action) {
            return { ...state, errorMessage: action.payload }
        },
        addOverviewOrders(state, action) {
            return { ...state, ordersOverview: action.payload }
        }
    }
})

export const getPendingOrdersHandler = (payload) => async (dispatch, state) => {
    try {
        let response = await Orders.getStorePendingOrders(payload)
        dispatch(addPendingOrders(response))
    } catch (error) {
        dispatch(errorMessage(error.message))
    }
}
export const getOverviewOrdersHandler = (data) => async (dispatch, state) => {
    try {
        let response = await Orders.getStoreNotPendingOrders(data)
        dispatch(addOverviewOrders(response))
    } catch (error) {
        dispatch(errorMessage(error.message))
    }
}

export const updateOrderItemHandler = payload => async (dispatch, state) => {
    try {
        let { status, result, message } = await Orders.updateOrderItem(payload)
        if (status === 200) {
            let newState = await state().orders.pendingOrders.orders.map(order => {
                let items=  order.items.map(item => {
                    if (item.id === result.id) return result;
                    else return item
                })
                return {...order, items: items}
            })
            dispatch(addPendingOrders({...state().orders.pendingOrders,orders:newState}))
        } else {
            dispatch(errorMessage(message))
        }
    } catch (error) {
        dispatch(errorMessage(error.message))
    }
}

export default orders.reducer
export const { addPendingOrders, errorMessage, addOverviewOrders } = orders.actions