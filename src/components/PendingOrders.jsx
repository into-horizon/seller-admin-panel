import React, { useState, useEffect } from 'react';
import { getPendingOrdersHandler } from 'src/store/orders';
import { connect } from 'react-redux'
import OrdersModel from './OrdersModel'
import { CSpinner } from '@coreui/react-pro';
import Paginator from './Paginator';



const PendingOrders = ({ orders, getPendingOrdersHandler, count }) => {
console.log("🚀 ~ file: PendingOrders.jsx ~ line 11 ~ PendingOrders ~ orders", orders)
    useEffect(() => {
        getPendingOrdersHandler()
    }, [])
    return (
        <>
            {orders ? <OrdersModel data={orders} /> : <CSpinner />}
            <Paginator count={Number(count)} changeData={getPendingOrdersHandler} cookie='pending'/>
        </>
    )
}
const mapStateToProps = (state) => ({
    orders: state.orders.pendingOrders.orders,
    count: state.orders.pendingOrders.count,
})
const mapDispatchToProps = { getPendingOrdersHandler }

export default connect(mapStateToProps, mapDispatchToProps)(PendingOrders)