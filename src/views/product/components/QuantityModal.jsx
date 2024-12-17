import React, { Children, useEffect, useState } from 'react'
import {
  CButton,
  CSpinner,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalFooter,
  CFormSelect,
  CModalTitle,
  CModalBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ColorSelector from 'src/components/ColorSelector'
import _ from 'lodash'
import { cilStorage, cilPlus } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import Multiselect from 'multiselect-react-dropdown'
import CSS_COLOR_NAMES from 'src/services/colors'

export const AddOwnComponent = ({ onClick, sizesType, values, addSizes }) => {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'addProduct',
  })
  return (
    <React.Fragment>
      <div className="addOwnSizes">
        <CFormLabel htmlFor="validationServer05">{t('sizes')}</CFormLabel>
        <CFormInput
          type="text"
          value={values.join(',') ?? ''}
          id="sizesInput"
          placeholder={t('inserSizes')}
          required
          onChange={addSizes}
        />
        <CButton color="secondary" type="button" onClick={onClick}>
          {t('add')}
        </CButton>
      </div>
    </React.Fragment>
  )
}

const QuantityModal = ({ product, updateSizeAndQuantity }) => {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'addProduct',
  })
  let temp = JSON.parse(product.size_and_color)
  let sizeSymbols = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  let sizeNumbers = _.range(30, 51)
  const [visible, setVisible] = useState(false)
  const [sizes, setSizes] = useState({ original: temp, updated: temp })
  const [colorAndSize, setColorAndSize] = useState({ color: '', size: '' })
  const [values, setValues] = useState([])
  const [SQLoad, setSQLoad] = useState(false)
  const [product_, setProduct] = useState({ color: false, size: false })
  const { size: productSize, color: productColor } = product_

  const [sizesType, setSizesType] = useState({
    add: false,
    data: [...sizeSymbols],
  })
  const closeQuantityModal = () => {
    setVisible(false)
  }
  useEffect(() => {
    if (product.size_and_color) {
      setProduct({
        color: temp.some((item) => item.color),
        size: temp.some((item) => item.size),
      })
    }
  }, [product])
  const updateSQHandler = (e) => {
    e.preventDefault()
    updateSizeAndQuantity({
      id: product.id,
      quantity:
        sizes.updated?.reduce((p, c) => p + Number(c.quantity), 0) || e.target.quantityInput.value,
      size_and_color: sizes.updated?.length > 0 ? JSON.stringify(sizes.updated) : null,
    })
    closeQuantityModal()
  }

  const updateSQ = (id, s) => {
    setSizeForm((x) => {
      return { ...x, visible: id }
    })
    if (s) {
      setSizes({ ...sizes, original: JSON.parse(s), updated: JSON.parse(s) })
      JSON.parse(s)
        .map((val) => val.color)
        .filter((val) => val).length > 0 &&
        setProduct((x) => {
          return { ...x, color: true }
        })
      JSON.parse(s)
        .map((val) => val.size)
        .filter((val) => val).length > 0 &&
        setProduct((x) => {
          return { ...x, size: true }
        })
    }
  }
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-close') || e.target.classList.contains('btn-danger')) {
      closeQuantityModal()
    } else {
      document.removeEventListener('click', (e) => {
        if (e.target.classList.contains('btn-close') || e.target.classList.contains('btn-danger')) {
          closeQuantityModal()
        } else {
          document.removeEventListener('click')
        }
      })
    }
  })

  const selectColors = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val, i) => {
          return {
            id: sizes.updated.length + i + 1,
            size: null,
            color: val.name,
            quantity: 0,
          }
        }),
      ],
    }
    x.updated = x.updated.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.size === value.size && t.color === value.color),
    )
    setSizes(x)
  }
  const removeColors = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val, i) => {
          return {
            id: sizes.original.length + i,
            size: null,
            color: val.name,
            quantity: 0,
          }
        }),
      ],
    }
    setSizes(x)
  }

  const select = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val) => {
          return { size: val.name, quantity: 0 }
        }),
      ],
    }
    x.updated = x.updated.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.size === value.size && t.color === value.color),
    )
    setSizes(x)
  }
  const remove = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val) => {
          return { size: val.name, quantity: 0 }
        }),
      ],
    }
    setSizes(x)
  }
  const updateQuantity = (e) => {
    // let y = [...sizes.updated]
    let x = sizes.updated.map((val) => {
      if (val.id === Number(e.target.id)) {
        return {
          ...val,
          quantity: Number(e.target.value) === 0 ? null : Number(e.target.value),
        }
      } else {
        return val
      }
    })
    setSizes({ ...sizes, updated: x })
  }
  const addSizes = (e) => {
    setValues((i) => [...e.target.value.split(',')])
    // if (e.target.value.includes(',')) {
    // }
  }

  const removeSize = (size) => {
    let newSizes = sizes.updated.filter((val) => val.id !== size)
    let newOriginal = sizes.original.filter((val) => val.id !== size)
    setSizes({ ...sizes, original: newOriginal, updated: newSizes })
  }

  const addOwnSizes = () => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.updated,
        ...values.map((val) => {
          return { size: val, quantity: 0 }
        }),
      ],
    }
    x.updated = x.updated.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.size === value.size && t.color === value.color),
    )
    setSizes(x)
    document.getElementById('sizesInput').value = null
  }
  const addSizeAndColor = () => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.updated,
        {
          id: sizes.updated.length + 1,
          color: colorAndSize.color,
          size: colorAndSize.size,
          quantity: 0,
        },
      ],
    }
    x.updated = x.updated.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.size === value.size && t.color === value.color),
    )
    setSizes(x)
  }
  const addNewSizes = () => {
    setSizesType((d) => {
      return { ...d, data: [...d.data, ...values] }
    })
    setValues([])
  }
  return (
    <>
      <CButton color="success" onClick={() => setVisible(true)}>
        <CIcon icon={cilStorage}></CIcon>
        {t('quantity')}
      </CButton>
      <CModal
        alignment="center"
        size={product.size_and_color && 'lg'}
        scrollable={true}
        visible={visible}
      >
        <CModalHeader closeButton>
          <CModalTitle>{t('quantity')}</CModalTitle>
        </CModalHeader>

        <form onSubmit={updateSQHandler}>
          <CModalBody style={{ height: `${productSize && !productColor ? '50vh' : ''}` }}>
            {!product.size_and_color && (
              <h6 style={{ margin: '2rem 0', textAlign: 'center' }}>
                <strong>{t('quantity')}: </strong>
                <input
                  className="discounRate"
                  id="quantityInput"
                  type="number"
                  min="1"
                  defaultValue={product.quantity}
                />
              </h6>
            )}
            <CRow>
              <CCol xs={6}>
                {productColor && !productSize && (
                  <div className="m-3">
                    {' '}
                    <Multiselect
                      options={CSS_COLOR_NAMES.filter(
                        (val) => !sizes.updated.map((v) => v.color).includes(val),
                      ).map((val, idx) => {
                        return { name: val, id: idx + 1 }
                      })}
                      onSelect={selectColors}
                      onRemove={removeColors}
                      selectedValues={(e) => console.log(e)}
                      displayValue="name"
                      placeholder={t('select')}
                    />
                  </div>
                )}
                {productSize && !productColor && (
                  <CRow>
                    <CCol xs="12">
                      <CFormCheck
                        type="radio"
                        name="s"
                        label={t('symbolSizes')}
                        onClick={() =>
                          setSizesType(() => ({
                            data: [...sizeSymbols],
                            add: false,
                          }))
                        }
                        onChange={() => ({})}
                        checked={sizesType.data.every((size) => typeof size === 'string')}
                      />
                    </CCol>
                    <CCol xs="12">
                      <CFormCheck
                        type="radio"
                        name="s"
                        label={t('numericSizes')}
                        onClick={() =>
                          setSizesType(() => ({
                            data: [...sizeNumbers],
                            add: false,
                          }))
                        }
                        onChange={() => ({})}
                        checked={sizesType.data.every((size) => typeof size === 'number')}
                      />
                    </CCol>
                    <CCol xs="12">
                      <CFormCheck
                        type="radio"
                        name="s"
                        label={t('addOther')}
                        onChange={() =>
                          setSizesType((original) => ({
                            ...original,
                            add: true,
                          }))
                        }
                        checked={sizesType.add}
                      />
                    </CCol>
                    <CCol xs={12}>
                      {!sizesType.add ? (
                        <Multiselect
                          options={sizesType.data.map((val, idx) => {
                            return { name: val, id: idx + 1 }
                          })}
                          onSelect={select}
                          onRemove={remove}
                          selectedValues={(e) => console.log(e)}
                          displayValue="name"
                          placeholder={t('select')}
                        />
                      ) : (
                        <AddOwnComponent
                          onClick={addOwnSizes}
                          sizesType={sizesType}
                          values={values}
                          addSizes={addSizes}
                        />
                      )}
                    </CCol>
                  </CRow>
                )}
                {productSize && productColor && (
                  <CRow className="padding">
                    <CCol md={12}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="sc"
                        label={t('symbolSizes')}
                        defaultChecked
                        id="symbolSizes"
                        onChange={() =>
                          setSizesType({
                            ...sizesType,
                            data: [...sizeSymbols],
                            add: false,
                          })
                        }
                      />
                      <label htmlFor="symbolSizes" className="form-check-label px-1">
                        {t('symbolSizes')}
                      </label>
                    </CCol>
                    <CCol md={12}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="sc"
                        id="numericSizes"
                        label={t('numericSizes')}
                        onChange={() =>
                          setSizesType({
                            ...sizesType,
                            data: [...sizeNumbers],
                            add: false,
                          })
                        }
                      />
                      <label htmlFor="numericSizes" className="form-check-label px-1">
                        {t('numericSizes')}
                      </label>
                    </CCol>
                    <CCol xs={12}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="sc"
                        id="addOther"
                        onChange={() => setSizesType({ ...sizesType, add: true })}
                      />
                      <label htmlFor="addOther" className="form-check-label px-1">
                        {t('addOther')}
                      </label>
                    </CCol>
                    <CCol md={4}>
                      <CFormSelect
                        value={colorAndSize.size}
                        onChange={(e) =>
                          setColorAndSize((x) => ({
                            ...x,
                            size: e.target.value,
                          }))
                        }
                      >
                        <option value="" disabled>
                          select size
                        </option>
                        {sizesType.data.map((val, idx) => (
                          <option key={idx + val} value={val}>
                            {val}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol xs={4}>
                      <ColorSelector
                        selectStatement
                        value={colorAndSize.color}
                        onChange={(e) =>
                          setColorAndSize((x) => ({
                            ...x,
                            color: e.target.value,
                          }))
                        }
                      />
                    </CCol>
                    <CCol md={4}>
                      <CButton
                        color="secondary"
                        onClick={addSizeAndColor}
                        disabled={!(colorAndSize.color && colorAndSize.size)}
                      >
                        <CIcon icon={cilPlus} size="sm"></CIcon>
                        {t('add')}
                      </CButton>
                    </CCol>
                    {sizesType.add && (
                      <div className="addOwnSizes">
                        <CFormLabel htmlFor="validationServer05">{t('sizes')}</CFormLabel>
                        <CFormInput
                          type="text"
                          value={values.join(',')}
                          id="sizesInput"
                          placeholder={t('inserSizes')}
                          required
                          onChange={addSizes}
                        />
                        <CButton color="secondary" type="button" onClick={addNewSizes}>
                          {t('add')}
                        </CButton>
                      </div>
                    )}
                  </CRow>
                )}
              </CCol>
              <CCol md={6}>
                <ul className="productUl">
                  {sizes?.updated?.length > 0 &&
                    Children.toArray(
                      sizes?.updated?.map((size, i) => (
                        <li className="mx-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              removeSize(size.id)
                            }}
                          >
                            X
                          </button>
                          {size.size && size.color && (
                            <>
                              <strong className="mx-3">{size.size}</strong> -
                              <strong className="mx-3">{size.color}</strong>
                            </>
                          )}
                          {size.size && !size.color && (
                            <strong className="mx-3">{size.size}</strong>
                          )}
                          {!size.size && size.color && (
                            <strong className="mx-3">{size.color}</strong>
                          )}
                          <input
                            min="0"
                            type="number"
                            id={size.id}
                            value={size.quantity}
                            onChange={updateQuantity}
                          />
                        </li>
                      )),
                    )}
                  {}{' '}
                </ul>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            {!SQLoad && (
              <CButton color="primary" type="submit">
                {t('submit')}
              </CButton>
            )}
            {!SQLoad && (
              <CButton color="danger" onClick={closeQuantityModal}>
                {t('cancel')}
              </CButton>
            )}
            {SQLoad && <CSpinner />}
          </CModalFooter>
        </form>
      </CModal>
    </>
  )
}

export default QuantityModal
