import React, { useState, useEffect } from 'react'
import { getPendingOrdersHandler, updatePendingParams } from 'src/store/orders'
import { connect, useDispatch, useSelector } from 'react-redux'
import OrdersModel from '../OrdersModel'
import Paginator from '../../../components/Paginator'
import { useTranslation } from 'react-i18next'
import LoadingSpinner from 'src/components/LoadingSpinner'
import { updateParamsHelper } from 'src/services/utils'

const PendingOrders = ({ orders, count }) => {
  const { loading, pendingParams } = useSelector((state) => state.orders)
  const { t } = useTranslation('order')
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getPendingOrdersHandler())
  }, [pendingParams])

  const pageChangeHandler = (page) => {
    dispatch(updatePendingParams(updateParamsHelper(pendingParams, page)))
  }
  if (loading) {
    return <LoadingSpinner />
  }
  return (
    <>
      <h2>{t('PENDING_ORDERS')}</h2>
      {!loading && orders.length > 0 && (
        <>
          <OrdersModel data={orders} />
          <Paginator
            count={Number(count)}
            onChangePage={pageChangeHandler}
            cookieName="pendingOrder"
            pageSize={pendingParams.limit}
            page={pendingParams.offset + 1}
          />
        </>
      )}
      {!loading && orders.length === 0 && (
        <h4 className="text-align-center">{t('NO_PENDING_ORDERS_MESSAGE')}</h4>
      )}
    </>
  )
}
const mapStateToProps = (state) => ({
  orders: state.orders.pendingOrders.orders,
  count: state.orders.pendingOrders.count,
})
const mapDispatchToProps = { getPendingOrdersHandler }

export default connect(mapStateToProps, mapDispatchToProps)(PendingOrders)
