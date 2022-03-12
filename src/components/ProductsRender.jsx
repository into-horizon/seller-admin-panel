import React, { useState, useEffect } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { CPaginationItem, CPagination, CButton, CSpinner } from '@coreui/react'
import { getProductsByStatusHandler, addProductPictureHandler, deleteProductPictureHandler } from 'src/store/product';
import { If, Then, Else } from 'react-if'
import { useTranslation } from 'react-i18next';
import { errorMessage } from '../store/product'
import Switch from "react-switch";
import cookie from 'react-cookies';

const ProductsRender = props => {
    let sizeSymbols = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    let sizeNumbers = []
    if (sizeNumbers.length === 0) {
        for (let i = 30; i <= 50; i++) {
            sizeNumbers.push(i)
        }

    }
    const products = useSelector(state => state.products)
    const dispatch = useDispatch()
    const initialState = { discount: false, discountRate: 1 }
    const { parentCategories, childCategories, grandChildCategories } = useSelector(state => state.category)
    const [currentProducts, setCurrentProducts] = useState({})
    const [pages, setPages] = useState([])
    const [selectedPage, setSelectedPage] = useState(Number(cookie.load('selectedPage')) || 1)
    const { t, i18n } = useTranslation('translation', { keyPrefix: 'addProduct' });
    const [loading, setLoading] = useState(true)
    const [discount, setDiscount] = useState(initialState)
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
        let btns = document.querySelectorAll('.addDiscountBtn')
        btns.forEach(val => val.setAttribute('disabled', 'true'))
    }

    const hideForm = id => {
        let form = document.getElementById(`form${id}`)
        form.style.display = 'none'
        let btns = document.querySelectorAll('.addDiscountBtn')
        btns.forEach(val => val.removeAttribute('disabled'))
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
        }
    }, [products.message])
    return (
        <div className="productsRender">

            {loading && <CSpinner />}
            {!loading && currentProducts.products.length === 0 && <h4 className="productStatusHead">{`you don't have ${props.status} products`}</h4>}
            {!loading && currentProducts.products?.map((product, idx) =>
                <div className="productRender" key={product.entitle + idx}>
                    <div className="productTitles">
                        <h3 className="productTitle">{`${t('englishTitle')}: ${product.entitle}`}</h3>
                        <h3 className="productTitle">{`${t('arabicTitle')}: ${product.artitle}`}</h3>
                    </div>
                    <div className="productPictures">
                        {[...product.pictures, ...completeArray(product.pictures.length)]?.map((picture, i) =>
                            <div key={picture.id + Math.random()}>
                                <If condition={picture.product_picture}>
                                    <Then>
                                        <CButton color="light" className="deleteBtn" onClick={() => props.deleteProductPictureHandler({ picture_id: picture.id })}>X</CButton>
                                        <img src={picture.product_picture} alt="" />
                                    </Then>
                                    <Else>
                                        <input type="file" id={product.id} hidden onChange={(e) => addProductPicture(e, product.id)} />
                                        <label htmlFor={product.id} className="uploadLabel">Choose file</label>
                                    </Else>
                                </If>

                            </div>
                        )}
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
                    {product.metatitle ? <h5>{`${t('metaTitle')}: ${product.metatitle}`}</h5> : null}
                    {product.sku ? <h5>{`${t('SKU')}: ${product.sku}`}</h5> : null}
                    {!product.size ? <h5>{`${t('quantity')}: ${product.quantity}`}</h5> : null}
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
                    <div className="productbtns">
                        <div className="productbtn">
                            <CButton color="secondary" className="addDiscountBtn" onClick={() => discountChange(product.id, product.discount, product.discount_rate)}>{t('editDiscount')}</CButton>

                            <form action="" className='discountForm' id={`form${product.id}`} style={{ display: 'none' }}>
                                <fieldset className="fieldset">
                                    <legend className="legend">Discount</legend >
                                    <div className='switchDiv'>
                                        <label className='switchLabel' htmlFor="">Discount</label>
                                        <Switch onChange={i => setDiscount({ ...discount, discount: i })} checked={discount.discount} />

                                    </div>
                                    <div style={{ display: discount.discount ? 'inherit' : 'none' }}>
                                        <label htmlFor="discounRate">Discount Rate</label>
                                        <input type="number" max='0.99' step='0.01' value={discount.discountRate} onChange={e => setDiscount({ ...discount, discountRate: e.target.value })} className="discounRate" />
                                    </div>
                                    <div className="discountFormBtns">
                                        <CButton color="primary">Submit</CButton>
                                        <CButton color="danger" onClick={() => hideForm(product.id)}>Cancel</CButton>

                                    </div>
                                </fieldset>
                            </form>
                        </div>
                        <div className="productbtn">
                            <CButton color="success">Edit sizes and quantity</CButton>
                            <form action="" className='SQForm'>
                                <fieldset className="fieldset">
                                    <legend className='legend'>{t('quantity')}</legend>
                                {!product.size && <h6><strong>{t('quantity')}: </strong><input type="number" min="1" defaultValue={product.quantity} /></h6>}
                                {product.size &&
                                    <ul className="productUl">
                                        {JSON.parse(product.size).map((size, i) =>
                                            <li key={`${i}${size.size}`} className="productLi">
                                                <button type="button">X</button>
                                                <strong>{size.size}</strong>
                                                <input type="number" defaultValue={size.quantity} />
                                            </li>)}
                                    </ul>
                                }
                                <div className="discountFormBtns">
                                    <CButton color="primary">Submit</CButton>
                                    <CButton color="danger" onClick={() => hideForm(product.id)}>Cancel</CButton>

                                </div>

                                </fieldset>
                            </form>
                        </div>
                        <div className="productbtn">

                            <CButton color="primary" >{t('editProduct')}</CButton>
                        </div>
                    </div>
                </div>
            )}
            <CPagination aria-label="Page navigation example">
                <CPaginationItem aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </CPaginationItem>

                {pages.map((val) => <CPaginationItem key={`page#${val}`} active={selectedPage === val} onClick={() => changePage(val)}>{val}</CPaginationItem>)}

                <CPaginationItem aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </CPaginationItem>
            </CPagination>
        </div>
    )
}
const mapStateToProps = (state) => ({

})

const mapDispatchToProps = { getProductsByStatusHandler, addProductPictureHandler, deleteProductPictureHandler }
export default connect(mapStateToProps, mapDispatchToProps)(ProductsRender)