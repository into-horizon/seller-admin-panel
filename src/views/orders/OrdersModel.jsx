import React, { useState, useEffect } from 'react'
import { getPendingOrdersHandler, updateOrderItemHandler } from 'src/store/orders'
import { connect } from 'react-redux'
import defaultProductImg from '../../assets/images/default-store-350x350.jpg'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CSpinner,
} from '@coreui/react'
import Pdf from '../../components/Pdf'
import { useTranslation } from 'react-i18next'
import { localizedDate, localizedNumber } from 'src/services/utils'
import { OrderItemAction } from './pending/components/OrderItemActionModal'

const OrderModel = ({ data }) => {
  const [loading, setLoading] = useState(true)
  const [itemAction, setItemAction] = useState('')
  const { t, i18n } = useTranslation(['order', 'color', 'global'])
  useEffect(() => {
    setLoading(false)
  }, [data])

  return (
    <>
      {loading && <CSpinner color="primary" />}
      {data?.map((order, idx) => (
        <div
          id="orders"
          key={idx}
          style={{
            border: '1px solid black',
            backgroundColor: 'white',
            borderRadius: '2rem',
            padding: '2rem',
            margin: '2rem 0',
          }}
        >
          <h5>{t('ORDER_DETAILS')}</h5>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>{t('ORDER_NUMBER')}</CTableHeaderCell>
                <CTableHeaderCell>{t('CUSTOMER_NAME')}</CTableHeaderCell>
                <CTableHeaderCell>{t('GRAND_TOTAL')}</CTableHeaderCell>
                <CTableHeaderCell>{t('STATUS')}</CTableHeaderCell>
                <CTableHeaderCell>{t('PLACED_AT')}</CTableHeaderCell>
                <CTableHeaderCell>{t('UPDATED_AT')}</CTableHeaderCell>
                <CTableHeaderCell>{t('DELIVERED_AT')}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>{order.customer_order_id}</CTableDataCell>
                <CTableDataCell>{`${order.first_name} ${order.last_name}`}</CTableDataCell>
                <CTableDataCell>
                  {localizedNumber(order.grand_total.toFixed(2), i18n.language)}
                </CTableDataCell>
                <CTableDataCell>{t(order.status.toUpperCase())}</CTableDataCell>
                <CTableDataCell>{localizedDate(order.created_at, i18n.language)}</CTableDataCell>
                <CTableDataCell>
                  {order.updated ? localizedDate(order.updated, i18n.language) : '-'}
                </CTableDataCell>
                <CTableDataCell>
                  {order.delivery_date ? localizedDate(order.delivery_date, i18n.language) : '-'}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          {order.items.map((item, i) => (
            <div key={i}>
              <h6>{t('ORDER_ITEMS')}</h6>
              <CTable key={i} align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>{t('IMAGE')}</CTableHeaderCell>
                    <CTableHeaderCell>{t('TITLE')}</CTableHeaderCell>
                    <CTableHeaderCell>{t('PRICE')}</CTableHeaderCell>
                    <CTableHeaderCell>{t('QUANTITY')}</CTableHeaderCell>
                    <CTableHeaderCell>{t('SIZE')}</CTableHeaderCell>
                    <CTableHeaderCell>{t('COLOR')}</CTableHeaderCell>
                    <CTableHeaderCell>{t('STATUS')}</CTableHeaderCell>
                    {item.status === 'pending' && (
                      <CTableHeaderCell>{t('ACTIONS')}</CTableHeaderCell>
                    )}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>
                      {item && (
                        <img
                          style={{ width: '7rem' }}
                          src={item.picture ?? defaultProductImg}
                          alt="img"
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{item[`${i18n.language}title`]}</CTableDataCell>
                    <CTableDataCell>{localizedNumber(item.price, i18n.language)}</CTableDataCell>
                    <CTableDataCell>{localizedNumber(item.quantity)}</CTableDataCell>
                    <CTableDataCell>{item.size ?? '-'}</CTableDataCell>
                    <CTableDataCell>
                      {item.color ? t(item.color?.capitalize(), { ns: 'color' }) : '-'}
                    </CTableDataCell>
                    <CTableDataCell>{t(item.status.toUpperCase())}</CTableDataCell>
                    {item.status === 'pending' && (
                      <CTableDataCell>
                        <OrderItemAction
                          item={item}
                          setItemAction={setItemAction}
                          itemAction={itemAction}
                        />
                      </CTableDataCell>
                    )}
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          ))}

          {order.status !== 'pending ' && <Pdf order={order} />}
        </div>
      ))}
    </>
  )
}

export default OrderModel
