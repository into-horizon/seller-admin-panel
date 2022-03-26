import React, { useState, useEffect } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { CPaginationItem, CPagination, CButton, CSpinner, CFormCheck, CFormInput, CFormLabel, CRow, CCol } from '@coreui/react'
import { getProductsByStatusHandler, addProductPictureHandler, deleteProductPictureHandler } from 'src/store/product';
import { If, Then, Else } from 'react-if'
import { useTranslation } from 'react-i18next';
import { errorMessage } from '../store/product'
import Switch from "react-switch";
import cookie from 'react-cookies';
import Multiselect from 'multiselect-react-dropdown';
import { useNavigate } from 'react-router-dom';
import { updateSizeAndQuantity, updateDiscount } from '../store/product'

const ProductsRender = props => {
    const { updateSizeAndQuantity, updateDiscount } = props;
    let sizeSymbols = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    let sizeNumbers = []
    if (sizeNumbers.length === 0) {
        for (let i = 30; i <= 50; i++) {
            sizeNumbers.push(i)
        }

    }
    const navigate = useNavigate()
    const products = useSelector(state => state.products)
    const dispatch = useDispatch()
    const initialState = { discount: { discount: false, discountRate: 1 }, sizes: { original: [], updated: [] } }
    const { parentCategories, childCategories, grandChildCategories } = useSelector(state => state.category)
    const [currentProducts, setCurrentProducts] = useState({})
    const [pages, setPages] = useState([])
    const [selectedPage, setSelectedPage] = useState(Number(cookie.load('selectedPage')) || 1)
    const { t, i18n } = useTranslation('translation', { keyPrefix: 'addProduct' });
    const [loading, setLoading] = useState(true)
    const [discount, setDiscount] = useState(initialState.discount)
    const [sizes, setSizes] = useState(initialState.sizes)
    const [sizesType, setSizesType] = useState({ add: false, data: [...sizeSymbols] })
    const [values, setValues] = useState([])
    const [SQLoad, setSQLoad] = useState(false)
    const [activeForm, setActiveForm] = useState(null)
    const [disabledBtn, setDisabledBtn] = useState({ SQBtn: false, discountBtn: false })

    useEffect(() => {
        if (cookie.load('currentStatus') !== props.status) {
            setSelectedPage(1)
            cookie.save('currentStatus', props.status)
        }
        props.getProductsByStatusHandler({ status: props.status, limit: 5, offset: 5 * (selectedPage - 1) })

    }, [props.status])
    useEffect(() => {
        let pagesCount = Math.ceil(products.currentProducts.count / 5 || 1)
        let p = []
        for (let i = 1; i <= pagesCount; i++) {
            p.push(i)
        }
        setPages(x => p)
    }, [products.currentProducts.count])
    useEffect(() => {
        if (products.currentProducts) {
            setCurrentProducts(products.currentProducts)
        }
    }, [products.currentProducts])

    const changePage = n => {
        setSelectedPage(n)
        cookie.save('selectedPage', n)
        props.getProductsByStatusHandler({ status: props.status, limit: 5, offset: 5 * (n - 1) })
    }

    const completeArray = x => {
        let arr = [];
        for (let i = 0; i < (5 - x); i++) {
            arr.push({ id: 'i' + 1, product_picture: null })
        }
        return arr
    }
    const addProductPicture = (e, id) => {
        let formData = new FormData();
        formData.append('image', e.target.files[0])
        formData.append('id', id)
        props.addProductPictureHandler(formData)
    }
    const changeBtnAlign = () => {
        let deleteBtn = document.querySelectorAll('.deleteBtn')
        if (i18n.language === 'ar' && deleteBtn.length > 0) {
            let className = deleteBtn[0].className.split(' ').slice(0, 3).join(' ')
            deleteBtn.forEach(button => button.setAttribute('class', `${className} deleteBtnAr`))
        } else if (i18n.language === 'en' && deleteBtn.length > 0) {
            let className = deleteBtn[0].className.split(' ').slice(0, 3).join(' ')
            deleteBtn.forEach(button => button.setAttribute('class', `${className} deleteBtnEn`))
        }
    }
    const reverseTitles = () => {
        if (i18n.language === 'ar' && (document.querySelectorAll('.productTitles').length > 0)) {
            let div = document.querySelectorAll('.productTitles')
            div.forEach((item) => item.style.flexDirection = 'row-reverse')
        } else if (i18n.language === 'en' && (document.querySelectorAll('.productTitles').length > 0)) {
            let div = document.querySelectorAll('.productTitles')
            div.forEach((item) => item.style.flexDirection = '')
        }
    }
    const discountChange = (id, d, r) => {
        let form = document.getElementById(`form${id}`)
        form.style.display = 'flex'
        setDiscount({ discount: d, discountRate: r })
        // let btns = document.querySelectorAll('.addDiscountBtn')
        // btns.forEach(val => val.setAttribute('disabled', 'true'))
        setDisabledBtn({ ...disabledBtn, discountBtn: true })
    }

    const hideForm = (id, c) => {
        let form = document.getElementById(`form${id}`)
        form.style.display = 'none'
        // let btns = document.querySelectorAll('.' + c)
        // btns.forEach(val => val.removeAttribute('disabled'))
        // setDiscount(initialState.discount)
        // setSizes(initialState.sizes)
        if (c === 'SQBtn') {
            setDisabledBtn({ ...disabledBtn, SQBtn: false })

        } else if (c === 'addDiscountBtn') {
            setDisabledBtn({ ...disabledBtn, discountBtn: false })
        }
        setSizes(initialState.sizes)


    }
    const updateSQ = (id, s) => {
        let form = document.getElementById(`formSQ${id}`)
        form.style.display = 'inherit'
        if (s) {
            setSizes({ ...sizes, original: JSON.parse(s), updated: JSON.parse(s) })

        }
        setDisabledBtn({ ...disabledBtn, SQBtn: true })

    }



    const select = e => {
        let x = { ...sizes, updated: [...sizes.original, ...e.map(val => { return { size: val.name, quantity: 0 } })] }
        x.updated = x.updated.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.size === value.size
            ))
        )
        setSizes(x)
    }
    const remove = e => {
        let x = { ...sizes, updated: [...sizes.original, ...e.map(val => { return { size: val.name, quantity: 0 } })] }
        setSizes(x)
    }
    const updateQuantity = e => {
        let y = [...sizes.updated]
        let x = y.map(val => {
            if (val.size === e.target.id) {
                return { size: val.size, quantity: Number(e.target.value) === 0 ? null : Number(e.target.value) }
            } else {
                return val
            }
        })
        setSizes({ ...sizes, updated: x })
    }
    const addSizes = e => {
        setValues(i => [...e.target.value.split(',')])
        if (e.target.value.includes(',')) {
        }
    }

    const removeSize = size => {
        let newSizes = sizes.updated.filter(val => val.size !== size)
        let newOriginal = sizes.original.filter(val => val.size !== size)
        setSizes({ ...sizes, original: newOriginal, updated: newSizes })
    }

    const updateSQHandler = (e, id) => {
        setSQLoad(true)
        setActiveForm(e.target.id)
        e.preventDefault()
        updateSizeAndQuantity({ id: id, quantity: sizes.updated.reduce((p, c) => p + Number(c.quantity), 0) || e.target.quantityInput.value, size: sizes.updated.length > 0 ? JSON.stringify(sizes.updated) : null })
    }

    const updateDiscountHandler = (e, id) => {
        setSQLoad(true)
        e.preventDefault()
        setActiveForm(e.target.id)
        updateDiscount({ id: id, discount: discount.discount, discount_rate: discount.discountRate })

    }

    const addOwnSizes = () => {
        let x = { ...sizes, updated: [...sizes.updated, ...values.map(val => { return { size: val, quantity: 0 } })] }
        x.updated = x.updated.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.size === value.size
        ))
    )
        setSizes(x);
        document.getElementById('sizesInput').value = null
    }

    useEffect(() => {
        reverseTitles()
        changeBtnAlign()
    }, [i18n.language])

    useEffect(() => {
        changeBtnAlign()
        reverseTitles()
    }, [document.querySelectorAll('.deleteBtn')])
    useEffect(() => {
        if (products.message && products.message.includes('success')) {
            setLoading(false)
            dispatch(errorMessage({ message: '' }))
        } else if (products.message && products.message.includes('updated')) {
            document.getElementById(activeForm).style.display = 'none'
            setSQLoad(false)
            setSizes(initialState.sizes)
            setDisabledBtn({ ...disabledBtn, SQBtn: false })
            dispatch(errorMessage({ message: '' }))
        }
    }, [products.message])
    return (
        <div className="productsRender">

            {loading && <CSpinner />}
            {!loading && currentProducts.products.length === 0 && <h4 className="productStatusHead">{t(`no${props.status}`)}</h4>}
            {!loading && currentProducts.products?.map((product, idx) =>
                <div className="productRender" key={product.entitle + idx}>
                    <div className="productTitles">
                        <h3 className="productTitle">{`${t('englishTitle')}: ${product.entitle}`}</h3>
                        <h3 className="productTitle">{`${t('arabicTitle')}: ${product.artitle}`}</h3>
                    </div>
                    <div className="productPictures">
                        {product.pictures.length > 0 || props.status !== 'pending' ? [...product.pictures, ...completeArray(product.pictures.length)]?.map((picture, i) =>
                            <div key={picture.id + Math.random()}>
                                <If condition={picture.product_picture}>
                                    <Then>
                                        <CButton color="light" className="deleteBtn" onClick={() => props.deleteProductPictureHandler({ picture_id: picture.id })} style={{ visibility: props.status === 'pending' ? 'hidden' : 'visible' }}>X</CButton>
                                        <img src={picture.product_picture} alt="" />
                                    </Then>
                                    <Else>
                                        <input type="file" id={product.id} hidden onChange={(e) => addProductPicture(e, product.id)} />
                                        <label htmlFor={product.id} className="uploadLabel" style={{ visibility: props.status === 'pending' ? 'hidden' : 'visible' }}>{t('choosePhoto')}</label>
                                    </Else>
                                </If>

                            </div>
                        ) : <h2>{t('noPictures')}</h2>}
                    </div>
                    <div className="productTitles">
                        <div>
                            <h4>{t('englishDescrition')}</h4>
                            <p style={{ textAlign: 'left' }}>{product.endescription}</p>
                        </div>
                        <div>
                            <h4>{t('arabicDescription')}</h4>
                            <p style={{ textAlign: 'right' }}>{product.ardescription}</p>

                        </div>
                    </div>
                    {product.metatitle && <h5><strong>{t('metatitle')}: </strong>{product.metatitle}</h5> }
                    {product.sku && ((i18n.language === 'en' && <h5><strong>{t('SKU')}:</strong>{product.sku}</h5>)  ||  (i18n.language === 'ar' && <h5>{product.sku}<strong> :{t('SKU')}</strong></h5>))}
                    {!product.size ? <h5><strong>{t('quantity')}: </strong>{product.quantity}</h5> : null}
                    <h6><strong>{`${t('parentCategory')}: `}</strong>{parentCategories.filter(v => v.id === product.parent_category_id)[0][`${i18n.language}title`]}</h6>
                    <h6><strong>{`${t('childCategory')}:`}</strong> {childCategories.filter(v => v.id === product.child_category_id)[0][`${i18n.language}title`]}</h6>
                    {product.grandchild_category_id ? <h6><strong>{`${t('grandChildCategory')}:`}</strong> {grandChildCategories.filter(v => v.id === product.grandchild_category_id)[0][`${i18n.language}title`]}</h6> : null}
                    <h6><strong>{`${t('price')}:`}</strong> {product.price + ' ' + t(`${product.currency}`)}</h6>
                    {product.brand_name ? <h6><strong>{`${t('brandName')}: `}</strong>{product.brand_name}</h6> : null}
                    <h6><strong>{t('hasDiscount')}: </strong>{product.discount ? t('yes') : t('no')}</h6>
                    {product.discount ? <h6><strong>{t('discountRate')}: </strong>{product.discount_rate * 100}%</h6> : null}
                    {product.size ?
                        <div>
                            <h6><strong>{t('sizes')}:</strong></h6>
                            <table className="sizesTable">
                                <thead>
                                    <tr>
                                        <th>{t('size')}</th>
                                        <th>{t('quantity')}</th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {JSON.parse(product.size).map(val => <tr key={val.size + val.quantity}><td>{val.size}</td><td>{val.quantity}</td></tr>)}

                                </tbody>
                                <thead>
                                    <tr>
                                        <th>{t('totalQuantity')}</th>
                                        <th>{product.quantity}</th>

                                    </tr>
                                </thead>
                            </table>
                        </div>
                        : null}
                    {props.status !== 'pending' && <div className="productbtns">
                        <div className="productbtn">
                            <CButton color="secondary" className="addDiscountBtn" disabled={disabledBtn.discountBtn} onClick={() => discountChange(product.id, product.discount, product.discount_rate)}>{t('editDiscount')}</CButton>

                            <form action="" className='discountForm' id={`form${product.id}`} style={{ display: 'none' }} onSubmit={e => updateDiscountHandler(e, product.id)}>
                                <fieldset className="fieldset">
                                    <legend className="legend">{t('discount')}</legend >
                                    <div className='switchDiv'>
                                        <label className='switchLabel' htmlFor="">{t('discount')}</label>
                                        <Switch onChange={i => setDiscount({ ...discount, discount: i })} checked={discount.discount} />

                                    </div>
                                    <div style={{ display: discount.discount ? 'inherit' : 'none' }}>
                                        <label htmlFor="discounRate">{t('discountRate')}</label>
                                        <input type="number" max='0.99' step='0.01' value={discount.discountRate} onChange={e => setDiscount({ ...discount, discountRate: e.target.value })} className="discounRate" />
                                    </div>
                                    <div className="discountFormBtns">
                                        {!SQLoad && <CButton color="primary" type="submit">{t('submit')}</CButton>}
                                        {!SQLoad && <CButton color="danger" onClick={() => hideForm(product.id, 'addDiscountBtn')}>{t('cancel')}</CButton>}
                                        {SQLoad && <CSpinner />}
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                        <div className="productbtn">
                            <CButton color="success" className="SQBtn" disabled={disabledBtn.SQBtn} onClick={() => updateSQ(product.id, product.size)}>{t('EditSQ')}</CButton>
                            <form action="" className='SQForm' id={`formSQ${product.id}`} style={{ display: 'none' }} onSubmit={(e) => updateSQHandler(e, product.id)}>
                                <fieldset className="fieldset">
                                    <legend className='legend'>{t('quantity')}</legend>
                                    {!product.size && <h6><strong>{t('quantity')}: </strong><input id="quantityInput" type="number" min="1" defaultValue={product.quantity} /></h6>}
                                    <CRow>
                                        <CCol md={6}>
                                            {product.size &&
                                                <div>
                                                    <div>
                                                        <section className='radioBtns' >

                                                            <section>
                                                                <CFormCheck type="radio" name="s" id="TC1" label={t('symbolSizes')} defaultChecked onChange={() => setSizesType({ ...sizesType, data: [...sizeSymbols], add: false })} />

                                                            </section>

                                                            <section>

                                                                <CFormCheck type="radio" name="s" id="TC2" label={t('numericSizes')} onChange={() => setSizesType({ ...sizesType, data: [...sizeNumbers], add: false })} />
                                                            </section>
                                                            <section>

                                                                <CFormCheck type="radio" name="s" id="TC2" label={t('addOther')} onChange={() => setSizesType({ ...sizesType, add: true })} />
                                                            </section>
                                                        </section>

                                                    </div>
                                                    <div >
                                                        {!sizesType.add && <Multiselect options={sizesType.data.map((val, idx) => { return { name: val, id: idx + 1 } })}
                                                            onSelect={select}
                                                            onRemove={remove}
                                                            selectedValues={e => console.log(e)}
                                                            displayValue="name"
                                                            placeholder={t('select')}
                                                        />}

                                                        {sizesType.add && <div className="addOwnSizes" >
                                                            <CFormLabel htmlFor="validationServer05">{t('sizes')}</CFormLabel>
                                                            <CFormInput type="text" id="sizesInput" placeholder={t('inserSizes')} required onChange={addSizes} />
                                                            <CButton color="secondary" type="button" onClick={addOwnSizes} >
                                                                {t('add')}
                                                            </CButton>
                                                        </div>}
                                                    </div>
                                                </div>

                                            }
                                        </CCol>
                                        <CCol md={6}>
                                            <ul className="productUl">
                                                {sizes.updated.length > 0 && sizes.updated.map((size, i) =>
                                                    <li key={`${i}${size.size}`} className="productLi">
                                                        <button type="button" onClick={() => removeSize(size.size)}>X</button>
                                                        <strong>{size.size}</strong>
                                                        <input type="number" id={size.size} value={size.quantity} onChange={updateQuantity} />
                                                    </li>)}
                                            </ul>
                                        </CCol>
                                    </CRow>
                                    <CCol xs={12}>

                                        <div className="discountFormBtns">
                                            {!SQLoad && <CButton color="primary" type="submit">{t('submit')}</CButton>}
                                            {!SQLoad && <CButton color="danger" onClick={() => hideForm(`SQ${product.id}`, 'SQBtn')}>{t('cancel')}</CButton>}
                                            {SQLoad && <CSpinner />}
                                        </div>

                                    </CCol>




                                </fieldset>
                            </form>
                        </div>
                        <div className="productbtn">

                            <CButton color="primary" onClick={() => { navigate(`/product/updateProduct?id=${product.id}`) }}>{t('editProduct')}</CButton>
                        </div>
                    </div>}
                </div>
            )}
            <CPagination aria-label="Page navigation example">
                <CPaginationItem aria-label="Previous" onClick={() => changePage(selectedPage - 1< 1? 1:selectedPage - 1 )}>
                    <span aria-hidden="true">&laquo;</span>
                </CPaginationItem>

                {pages.map((val) => <CPaginationItem key={`page#${val}`} active={selectedPage === val} onClick={() => changePage(val)}>{val}</CPaginationItem>)}

                <CPaginationItem aria-label="Next" onClick={() => changePage(selectedPage + 1> pages.length?  pages.length: selectedPage + 1)}>
                    <span aria-hidden="true">&raquo;</span>
                </CPaginationItem>
            </CPagination>
        </div>
    )
}
const mapStateToProps = (state) => ({

})

const mapDispatchToProps = { getProductsByStatusHandler, addProductPictureHandler, deleteProductPictureHandler, updateSizeAndQuantity, updateDiscount }
export default connect(mapStateToProps, mapDispatchToProps)(ProductsRender)