import React, { useState, useEffect } from 'react';
import { getOverviewOrdersHandler } from '../store/orders'
import OrdersModel from './OrdersModel'
import { connect } from 'react-redux'
import Paginator from './Paginator';
import { CForm, CFormSelect, CButton, CRow, CCol, CSpinner, CFormCheck, CFormInput } from '@coreui/react';

import CIcon from '@coreui/icons-react';
import { cilSearch } from '@coreui/icons';
const OrdersOverview = ({ getOverviewOrdersHandler, orders, count }) => {
    useEffect(() => {
        Promise.all([getOverviewOrdersHandler()]).then(() => setLoading(false))
    }, [])

    const [orderStatus, setOrderStatus] = useState('')
    const [searchType, setSearchType] = useState('status')
    const [orderId, setOrder] = useState('')
    const [loading, setLoading] = useState(true)
    const submitHandler = e => {
        setLoading(true)
        setOrder(e.target.order?.value)
        setOrderStatus(e.target.status?.value)
        e.preventDefault();
        Promise.all([getOverviewOrdersHandler({ status: e.target.status?.value, order_id: e.target.order?.value})]).then(() => setLoading(false))

    }
    return (
        <>
            <CRow className='background'>
                <CCol md={2}>
                    <strong>search by</strong>
                </CCol>
                <CCol md={2}>

                    <CFormCheck type='radio' name='search' value="status" label="order status" defaultChecked onChange={e=> setSearchType(e.target.value)}/>
                </CCol>
                <CCol md={2}>

                    <CFormCheck type='radio' name='search' value="number" label="order number" onChange={e=> setSearchType(e.target.value)}/>
                </CCol>

                {searchType === 'status' && <CForm onSubmit={submitHandler} className='mgn-top50'>
                    <CRow>
                        <CCol >
                            <CFormSelect id="status" onChange={e => setOrderStatus(e.target.value)}>
                                <option value='' >All</option>
                                <option value='canceled'>canceled</option>
                                <option value='accepted'>accepted</option>
                                <option value='pending'>pending</option>
                            </CFormSelect>

                        </CCol>
                        <CCol>

                            <CButton type="submit" ><CIcon icon={cilSearch} />search</CButton>
                        </CCol>
                    </CRow>

                </CForm>}
                {searchType === 'number' && <CForm className='mgn-top50' onSubmit={submitHandler}>
                    <CRow>
                        <CCol>

                            <CFormInput type="text" placeholder="order number" aria-label="default input example" id='order'/>
                        </CCol>
                        <CCol>

                            <CButton type="submit" ><CIcon icon={cilSearch} />search</CButton>
                        </CCol>

                    </CRow>
                </CForm>}
            </CRow>

            {loading ? <CSpinner /> : <>
                <OrdersModel data={orders} />
                <Paginator count={Number(count)} changeData={getOverviewOrdersHandler} status={orderStatus} order_id={orderId} cookie='overview' /></>}
        </>
    )
}

const mapStateToProps = (state) => ({
    orders: state.orders.ordersOverview.orders,
    count: state.orders.ordersOverview?.count
})

const mapDispatchToProps = { getOverviewOrdersHandler }

export default connect(mapStateToProps, mapDispatchToProps)(OrdersOverview)