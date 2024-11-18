import {
  CButton,
  CCol,
  CForm,
  CFormSelect,
  CModal,
  CModalFooter,
  CModalHeader,
  CRow,
} from '@coreui/react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { updateOrderItemHandler } from 'src/store/orders'

const { useState } = require('react')

export const OrderItemAction = ({ item, setItemAction, itemAction }) => {
  const { t } = useTranslation(['order', 'color', 'global'])

  const { entitle } = item
  const [visible, setVisible] = useState(false)
  const closeModel = () => {
    setVisible(false)
  }
  const dispatch = useDispatch()
  const updateItem = (e, item) => {
    e.preventDefault()
    dispatch(
      updateOrderItemHandler({
        ...item,
        status: e.target.status.value,
        cancellation_reason: e.target.cancellation_reason?.value ?? null,
      }),
    )
    closeModel()
  }
  return (
    <>
      <CButton color="secondary" onClick={() => setVisible(true)}>
        {t('TAKE_ACTION')}
      </CButton>
      <CModal visible={visible} alignment="center" onClose={closeModel}>
        <CModalHeader>{entitle}</CModalHeader>

        <CForm onSubmit={(e) => updateItem(e, item)}>
          <CRow>
            <CCol md={11}>
              <CFormSelect
                id="status"
                onChange={(e) => {
                  e.stopPropagation()
                  setItemAction(e.target.value)
                }}
                className="m-2-1rem"
                value={itemAction}
              >
                <option value="accepted">{t('APPROVE')}</option>
                <option value="canceled">{t('reject'.toUpperCase())}</option>
              </CFormSelect>
            </CCol>
            {itemAction === 'canceled' && (
              <CCol md={11} className="m-2-1rem">
                <CFormSelect id="cancellation_reason" required={itemAction === 'rejected'}>
                  <option value="incorrect item">{t('INCORRECT_ITEM')}</option>
                  <option value="out of stock">{t('OUT_OF_STOCK')}</option>
                  <option value="defective">{t('defective'.toUpperCase())}</option>
                </CFormSelect>
              </CCol>
            )}
          </CRow>
          <CModalFooter>
            <CButton color="secondary" type="button" onClick={closeModel}>
              {t('close')}
            </CButton>
            <CButton type="submit">{t('submit'.toLowerCase(), { ns: 'global' })}</CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}
