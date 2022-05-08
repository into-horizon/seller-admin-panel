import React, { useState, useEffect } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { CFormSelect, CFormLabel, CFormText, CFormCheck, CFormInput, CButton, CFormFloating, CFormTextarea, CFormFeedback, CCol, CForm, CRow, CInputGroup, CInputGroupText } from '@coreui/react'
import { If, Then, Else } from 'react-if'
import { useSelector, connect, useDispatch } from 'react-redux';
import { addProductHandler, errorMessage } from 'src/store/product';
import { usePopup, DialogType, AnimationType, ToastPosition } from "react-custom-popup";
import { useTranslation } from 'react-i18next';

const AddProduct = props => {
    const dispatch = useDispatch()
    const { showOptionDialog, showToast, showAlert } = usePopup();
    const { t, i18n } = useTranslation('translation', { keyPrefix: 'addProduct' });
    const category = useSelector(state => state.category)
    const products = useSelector(state => state.products)
    const { addProductHandler } = props
    let sizeSymbols = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    let sizeNumbers = []
    if (sizeNumbers.length === 0) {
        for (let i = 30; i <= 50; i++) {
            sizeNumbers.push(i)
        }

    }

    const initialState = {
        values: [],
        secondCategory: { visible: false },
        thirdCategory: { visible: false, selected: false, add: false, select: true },
        sizes: { visible: false, add: false },
        selectedSizes: [],
        sizesDetails: [],
        discount: { hasDiscount: false, discountRate: 0 }
    }
    const [values, setValues] = useState([])
    const [secondCategory, setSecondCategory] = useState({ visible: false, data: [] })
    const [thirdCategory, setThirdCategory] = useState({ visible: false, selected: false, add: false, select: true, data: [] })
    const [sizes, setSizes] = useState({ visible: false, add: false, data: [...sizeSymbols] })
    const [selectedSizes, setSelectedSizes] = useState([])
    const [sizesDetails, setSizesDetails] = useState([])
    const [discount, setDiscount] = useState({ hasDiscount: false, discountRate: 0 })


    const updateSizes = e => {
        let newSizes = sizesDetails.filter(val => val.size !== e.target.id)
        setSizesDetails([...newSizes, { size: e.target.id, quantity: Number(e.target.value) }])
    }
    const select = e => {
        let x = [...e]
        setSelectedSizes(x)
    }
    const remove = e => {

        setSelectedSizes(i => [...e])
    }

    const submitHandler = (e) => {
        e.preventDefault();
        let obj = {
            entitle: e.target.entitle.value,
            artitle: e.target.artitle.value,
            metatitle: e.target.metatitle.value,
            sku: e.target.sku.value,
            price: Number(e.target.price.value),
            brand_name: e.target.brandName.value,
            quantity: sizesDetails.reduce((p, c) => p + Number(c.quantity), 0) || Number(e.target.quantity.value),
            endescription: e.target.endescription.value,
            ardescription: e.target.ardescription.value,
            parent_category_id: e.target.parentCategory.value,
            child_category_id: e.target.childCategory.value,
            grandchild_category_id: e.target.grandChildCategory.value === 'default' ? null : e.target.grandChildCategory.value,
            size: sizesDetails.length > 0 ? JSON.stringify(sizesDetails) : null,
            discount: discount.hasDiscount,
            discount_rate: discount.discountRate,
        }


        let formData = new FormData();
        if (e.target.image.files.length > 5) {
            return showAlert({
                type: DialogType.WARNING,
                text: t('imageLimitText'),
                title: t('imageLimit'),
                animationType: AnimationType.ZOOM_IN,
            })
        }
        if (obj.parent_category_id === 'default' || obj.child_category_id === 'default' || (obj.grandchild_category_id === 'default' && thirdCategory.selected)) {
            return showAlert({
                type: DialogType.WARNING,
                text: t('categoryText'),
                title: t('categoryTitle'),
                animationType: AnimationType.ZOOM_IN,
            })

        }
        for (let i = 0; i < e.target.image.files.length; i++) {
            formData.append('image', e.target.image.files[i], e.target.image.files[i].name)
        }
        Object.entries(obj).forEach(([key, value]) => {
            if (value === null) {
                return
            } else {
                formData.append(key, value)
            }
        }
        )
        addProductHandler(formData)

    }

    const categoryVisibility = e => {
        let x = { ...secondCategory, visible: true }
        setSecondCategory(x)
    }
    const categoryVisibility2 = e => {
        let x = { ...thirdCategory, visible: true }
        setThirdCategory(x)
    }

    const addSizes = e => {

        setValues(i => [...e.target.value.split(',')])
        if (e.target.value.includes(',')) {
        }

    }

    useEffect(() => {
        let productForm = document.getElementById('productForm');
        if (products.message.includes('successfully')) {
            showToast({
                type: DialogType.SUCCESS,
                text: t('doneSuccessfully'),
                timeoutDuration: 3000,
                showProgress: true,
                position: ToastPosition[t('position')]
            })
            productForm.reset()
            setSecondCategory({ ...secondCategory, ...initialState.secondCategory })
            setThirdCategory({ ...thirdCategory, ...initialState.thirdCategory })
            setSizes({ ...sizes, ...initialState.sizes })
            setDiscount({ ...discount, ...initialState.discount })
        } else if (products.message.includes('something')) {
            showAlert({
                type: DialogType.DANGER,
                text: t('somethingWentWrong'),
                timeoutDuration: 3000,
                showProgress: true,
            })
        } else if (products.message) {
            showAlert({
                type: DialogType.ALERT,
                text: products.message,
                timeoutDuration: 3000,
                showProgress: true,
            })
        }
        dispatch(errorMessage({ message: '' }))
    }, [products.message])

    useEffect(() => {
        let labels = document.querySelectorAll('#label')
        if (i18n.language === 'ar') {
            labels.forEach(label => label.setAttribute('class', 'rightBorder'))
        } else if (i18n.language === 'en') {
            labels.forEach(label => label.setAttribute('class', 'leftBorder'));
        }

    }, [i18n.language])
    return (
        <>

            <h2>{t('add_product')}</h2>

            <form id='productForm' className="productForm" onSubmit={submitHandler}>
                <section className="productInputs">
                </section>
                <CRow xs={{ cols: 'auto' }}>
                    <div className="row justify-content-md-center mrgn50">
                        <CCol  >
                            <CCol>

                                <label>{t('englishTitle')}*</label>
                            </CCol>
                            <CCol>
                                <input type="text" id="entitle" placeholder={t('englishTitle')} required />

                            </CCol>

                        </CCol>
                        <CCol   >
                            <CCol>
                                <label >{t('arabicTitle')}*</label>

                            </CCol>
                            <CCol>
                                <input type="text" id="artitle" placeholder={t('arabicTitle')} required />

                            </CCol>
                        </CCol>
                        <CCol >
                            <CCol>

                                <label >{t('metaTitle')}</label>
                            </CCol>
                            <CCol>
                                < input type="text" id="metatitle" placeholder={t('metaTitle')} />

                            </CCol>
                        </CCol>
                        <CCol >
                            <CCol>
                                <label >SKU</label>

                            </CCol>
                            <CCol>

                                < input type="text" id="sku" placeholder="SKU" />
                            </CCol>
                        </CCol>
                        <CCol >
                            <CCol>
                                <label >{t('price')}*</label>

                            </CCol>
                            <CCol>
                                < input type="number" className={`no${i18n.language}`} id="price" placeholder={t('price')} step='0.01' required />

                            </CCol>
                        </CCol>
                        <CCol  >
                            <CCol>
                                <label >{t('brandName')}</label>

                            </CCol>
                            <CCol>
                                <input type="text" id="brandName" placeholder={t('brandName')} />

                            </CCol>
                        </CCol>
                        {!sizes.visible && <CCol sm="auto" >
                            {/* <section className="quantity" >
                                </section>
                                <section className="quantityInputs">
                            </section> */}
                            {/* <CCol xs={12} md={12}> 
                            </CCol> */}
                            <CRow>

                                <label>{t('quantity')}*</label>
                            </CRow>
                            <CRow>

                                <input type="number" id="quantity" className={`no${i18n.language}`} placeholder={t('quantity')} />
                            </CRow>
                            <CRow>
                                <label>{t('quantityLabel')}</label>

                            </CRow>



                        </CCol>}

                    </div>
                </CRow>

                <div className="row justify-content-md-center mrgn50">
                    <div className='description'>
                    </div>


                    <CCol md={6}>
                        <CFormFloating>
                            <CFormTextarea
                                placeholder="Leave a comment here"
                                id="endescription"
                                style={{ height: '100px' }}
                            ></CFormTextarea>
                            <CFormLabel htmlFor="floatingTextarea2" required>{t('englishDescrition')}*</CFormLabel>
                        </CFormFloating>
                    </CCol>
                    <CCol md={6}>
                        <CFormFloating>
                            <CFormTextarea
                                placeholder="Leave a comment here"
                                id="ardescription"
                                style={{ height: '100px' }}
                            ></CFormTextarea>
                            <CFormLabel htmlFor="floatingTextarea3" required>{t('arabicDescription')}*</CFormLabel>
                        </CFormFloating>
                    </CCol>

                </div>
                <div className='marginDiv'>
                    <CFormSelect aria-label="Default select example" required onChange={categoryVisibility} id='parentCategory'>
                        <option value='default'>{t('parentCategory')}</option>
                        {category ? category.parentCategories.map((val, idx) =>
                            <option value={val.id} key={`parent_Category_${idx}`}>{val[`${i18n.language}title`]}</option>
                        )

                            : null}

                    </CFormSelect>
                </div>
                <div className='marginDiv'>
                    <CFormSelect aria-label="Default select example" disabled={!secondCategory.visible} onChange={categoryVisibility2} id='childCategory'>
                        <option value='default'>{t('childCategory')}</option>

                        {category ? category.childCategories.map((val, idx) =>
                            <option value={val.id} key={`child_Category_${idx}`}>{val[`${i18n.language}title`]}</option>
                        )

                            : null}
                    </CFormSelect>
                </div>

                <section className="TCS" >
                    <section>
                        <CFormCheck id="flexCheckDefault" label={t('selectOrAdd')} onChange={e => setThirdCategory({ ...thirdCategory, selected: e.target.checked })} disabled={!thirdCategory.visible} />
                    </section>
                    <section style={{ display: thirdCategory.selected ? 'inherit' : 'none', width: '20%' }}>
                        <section>
                            <CFormCheck type="radio" name="TC" id="TC1" label={t('selectThird')} defaultChecked onChange={e => setThirdCategory({ ...thirdCategory, select: !thirdCategory.select, add: !thirdCategory.add })} />

                        </section>
                        <section>

                            <CFormCheck type="radio" name="TC" id="TC2" label={t('addOwn')} onChange={e => setThirdCategory({ ...thirdCategory, select: !thirdCategory.select, add: !thirdCategory.add })} />
                        </section>

                        <CFormSelect aria-label="Default select example" id='grandChildCategory' disabled={!thirdCategory.visible} style={{ display: thirdCategory.select ? 'inherit' : 'none' }} >
                            <option value='default'>{t('grandChildCategory')}</option>

                            {category ? category.grandChildCategories.map((val, idx) =>
                                <option value={val.id} key={`grand_child_Category_${idx}`}>{val[`${i18n.language}title`]}</option>
                            )

                                : null}
                        </CFormSelect>


                        <input type={thirdCategory.add ? 'text' : 'hidden'} placeholder={t('addOwn')} className='thirdCategory' disabled={!thirdCategory.visible} id='addGrandChildCategory' />
                    </section>


                </section>
                <section className="TCS" >
                    <section>
                        <CFormCheck id="size" label={t('sizes')} onChange={e => setSizes({ ...sizes, visible: e.target.checked })} />
                    </section>
                    <section className='radioBtns' style={{ display: sizes.visible ? 'inherit' : 'none', width: '20%' }}>
                        <section>
                            <CFormCheck type="radio" name="s" id="TC1" label={t('symbolSizes')} defaultChecked onChange={() => setSizes({ ...sizes, data: [...sizeSymbols], add: false })} />

                        </section>

                        <section>

                            <CFormCheck type="radio" name="s" id="TC2" label={t('numericSizes')} onChange={() => setSizes({ ...sizes, data: [...sizeNumbers], add: false })} />
                        </section>
                        <section>

                            <CFormCheck type="radio" name="s" id="TC2" label={t('addOther')} onChange={() => setSizes({ ...sizes, add: true })} />
                        </section>


                        <If condition={!sizes.add}>
                            <Then>
                                <Multiselect options={sizes.data.map((val, idx) => { return { name: val, id: idx + 1 } })}
                                    onSelect={select}
                                    onRemove={remove}
                                    selectedValues={e => console.log(e)}
                                    displayValue="name"
                                    placeholder={t('select')}
                                />

                            </Then>
                            <Else>
                                <CRow >
                                    <CFormLabel htmlFor="validationServer05">{t('sizes')}</CFormLabel>
                                    <CFormInput type="text" id="sizesInput" placeholder={t('inserSizes')} required onChange={addSizes} />
                                    <CButton color="secondary" type="button" onClick={() => setSelectedSizes(i => values.map((val, idx) => { return { name: val, id: idx++ } }))} >
                                        {t('add')}
                                    </CButton>
                                </CRow>
                            </Else>
                        </If>
                        <div className="sizesContainer">
                            {selectedSizes.map((val, idx) =>
                                <div key={`size${idx}`} className="marginDiv sizesDiv"  >
                                    {/* <input type="text" id={`size${idx}`} defaultValue={val.name} key={`size${idx}`} /> */}
                                    <h5 className="sizeHead">{val.name}: </h5>
                                    <input type="number" id={val.name} key={`sizeQty${idx}`} placeholder={t('quantity')} onChange={updateSizes} />
                                </div>
                            )

                            }

                        </div>

                    </section>
                    <section className="discountSection">
                        <section>

                            <CFormCheck id="discount" label={t('hasDiscount')} onChange={e => setDiscount({ ...discount, hasDiscount: e.target.checked })} />
                            <input type={discount.hasDiscount ? 'number' : 'hidden'} placeholder={t('insertDiscount')} className="discountRate" step="0.01" max="0.99" onChange={e => setDiscount({ ...discount, discountRate: Number(e.target.value) })} />
                        </section>

                        <label>{t('discountLabel')}</label>
                    </section>

                    <hr />
                    <CInputGroup className="mb-3 upload">
                        <section>
                            <CFormInput type="file" id="image" multiple="multiple" onChange={e => console.log(e.target.files[0])} />
                        </section>
                        <br />
                        <section>
                            <label>{t('uploadLabel')}</label>

                        </section>
                    </CInputGroup>

                    <label>- * {t('required')}</label>
                </section>
                <CButton type="submit" color="primary">
                    {t('submit')}
                </CButton>
            </form>
        </>

    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = { addProductHandler }
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);