import React, { useState, useEffect } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { CFormSelect, CFormLabel, CFormText, CFormCheck, CFormInput, CButton, CFormFloating, CFormTextarea, CFormFeedback, CCol, CForm, CRow, CInputGroup, CInputGroupText } from '@coreui/react'
import { If, Then, Else } from 'react-if'
import { useSelector, connect } from 'react-redux';
import { addProductHandler } from 'src/store/product';
import { usePopup, DialogType, AnimationType } from "react-custom-popup";
import { useTranslation } from 'react-i18next';
// import { CRow } from '@coreui/react-pro';
const AddProduct = props => {
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
            grandchild_category_id: e.target.grandChildCategory.value || null,
            size: sizesDetails.length > 0 ? JSON.stringify(sizesDetails) : null,
            discount: discount.hasDiscount,
            discount_rate: discount.discountRate,
        }


        let formData = new FormData();
        if (e.target.image.files.length > 5) {
            return showAlert({
                type: DialogType.WARNING,
                text: 'please reduce the number of images',
                title: 'image limit exceeded',
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
        // if(products.message.includes('successfully')){
          
        //     e.target.reset()
        // }
       
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
        if(products.message.includes('successfully')){
            showToast({
                type: DialogType.SUCCESS,
                text: 'doneUpdating',
                timeoutDuration: 3000,
                showProgress: true,
            })
            productForm.reset()
        } else if(products.message.includes('something')){
            showToast({
                type: DialogType.DANGER,
                text: 'something went wrong',
                timeoutDuration: 3000,
                showProgress: true,
            })
        } else if(products.message){
            showToast({
                type: DialogType.ALERT,
                text: products.message,
                timeoutDuration: 3000,
                showProgress: true,
            })
        }
    }, [products.message])


    return (
        <>

            <h2>{t('add_product')}</h2>
            {/* <Multiselect options={options}
                onSelect={select}
                onRemove={remove}
                selectedValues={values}
                displayValue="name"
            /> */}
            <form id='productForm' className="productForm" onSubmit={submitHandler}>
                <section className="productInputs">
                    <div>
                        <label className="label">{t('englishTitle')}</label>
                        <input type="text" id="entitle" placeholder={t('englishTitle')} required />
                    </div>
                    <div>
                        <label className="label">{t('arabicTitle')}</label>
                        <input type="text" id="artitle" placeholder={t('arabicTitle')} required />
                    </div>
                    <div>
                        <label className="label">{t('metaTitle')}</label>
                        < input type="text" id="metatitle" placeholder={t('metaTitle')} />
                    </div>
                    <div>
                        <label className="label">SKU</label>
                        < input type="text" id="sku" placeholder="SKU" />
                    </div>
                    <div>
                        <label className="label">{t('price')}</label>
                        < input type="number" id="price" placeholder={t('price')} required />
                    </div>
                    <div>
                        <label className="label">{t('brandName')}</label>
                        <input type="text" id="brandName" placeholder={t('brandName')} />
                    </div>
                    <div style={{ display: !sizes.visible ? 'inherit' : 'none' }}>
                        <label className="label">{t('quantity')}</label>
                        <input type="number" id="quantity" placeholder={t('quantity')} />
                    </div>

                </section>
                <div className='marginDiv'>
                    <div className='description'>

                    <CFormFloating>
                        <CFormTextarea
                            placeholder="Leave a comment here"
                            id="endescription"
                            style={{ height: '100px' }}
                        ></CFormTextarea>
                        <CFormLabel htmlFor="floatingTextarea2">{t('englishDescrition')}</CFormLabel>
                    </CFormFloating>
                    <CFormFloating>
                        <CFormTextarea
                            placeholder="Leave a comment here"
                            id="ardescription"
                            style={{ height: '100px' }}
                        ></CFormTextarea>
                        <CFormLabel htmlFor="floatingTextarea3">{t('arabicDescription')}</CFormLabel>
                    </CFormFloating>

                    </div>

                </div>
                <div className='marginDiv'>
                    <CFormSelect aria-label="Default select example" required onChange={categoryVisibility} id='parentCategory'>
                        <option>{t('parentCategory')}</option>
                        {category ? category.parentCategories.map((val, idx) =>
                            <option value={val.id} key={`parent_Category_${idx}`}>{val[`${i18n.language}title`]}</option>
                        )

                            : null}
                        {/* <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3" disabled>Three</option> */}
                    </CFormSelect>
                </div>
                <div className='marginDiv'>
                    <CFormSelect aria-label="Default select example" disabled={!secondCategory.visible} onChange={categoryVisibility2} id='childCategory'>
                        <option>{t('childCategory')}</option>

                        {category ? category.childCategories.map((val, idx) =>
                            <option value={val.id} key={`child_Category_${idx}`}>{val[`${i18n.language}title`]}</option>
                        )

                            : null}
                    </CFormSelect>
                </div>

                <section className="TCS" >
                    <section>
                        <CFormCheck id="flexCheckDefault" label="Select or Add third category" onChange={e => setThirdCategory({ ...thirdCategory, selected: e.target.checked })} disabled={!thirdCategory.visible} />
                    </section>
                    <section style={{ display: thirdCategory.selected ? 'inherit' : 'none', width: '20%' }}>
                        <section>
                            <CFormCheck type="radio" name="TC" id="TC1" label="Select Third Category" defaultChecked onChange={e => setThirdCategory({ ...thirdCategory, select: !thirdCategory.select, add: !thirdCategory.add })} />

                        </section>
                        <section>

                            <CFormCheck type="radio" name="TC" id="TC2" label="Add my own category" onChange={e => setThirdCategory({ ...thirdCategory, select: !thirdCategory.select, add: !thirdCategory.add })} />
                        </section>

                        <CFormSelect aria-label="Default select example" disabled={!thirdCategory.visible} style={{ display: thirdCategory.select ? 'inherit' : 'none' }} id='grandChildCategory'>
                            <option>{t('grandChildCategory')}</option>

                            {category ? category.grandChildCategories.map((val, idx) =>
                                <option value={val.id} key={`grand_child_Category_${idx}`}>{val[`${i18n.language}title`]}</option>
                            )

                                : null}
                        </CFormSelect>


                        <input type={thirdCategory.add ? 'text' : 'hidden'} placeholder=" add your own category" className='thirdCategory' disabled={!thirdCategory.visible} id='grandChildCategory' />
                    </section>


                </section>
                <section className="TCS" >
                    <section>
                        <CFormCheck id="size" label="Has Sizes" onChange={e => setSizes({ ...sizes, visible: e.target.checked })} />
                    </section>
                    <section className='radioBtns' style={{ display: sizes.visible ? 'inherit' : 'none', width: '20%' }}>
                        <section>
                            <CFormCheck type="radio" name="s" id="TC1" label="Symbol Sizes" defaultChecked onChange={() => setSizes({ ...sizes, data: [...sizeSymbols], add: false })} />

                        </section>

                        <section>

                            <CFormCheck type="radio" name="s" id="TC2" label="Numeric Sizes" onChange={() => setSizes({ ...sizes, data: [...sizeNumbers], add: false })} />
                        </section>
                        <section>

                            <CFormCheck type="radio" name="s" id="TC2" label="Add Other Type of Sizes" onChange={() => setSizes({ ...sizes, add: true })} />
                        </section>

                        {/* <CFormSelect aria-label="Default select example"  >
                            <option disabled>Sizes</option>
                            {sizes.data.map((val, idx) =>
                          
                          <option value={val} key={idx+val}>{val}</option>
                          
                            )
                            
                            }
                           
                        </CFormSelect> */}
                        <If condition={!sizes.add}>
                            <Then>
                                <Multiselect options={sizes.data.map((val, idx) => { return { name: val, id: idx + 1 } })}
                                    onSelect={select}
                                    onRemove={remove}
                                    selectedValues={e => console.log(e)}
                                    displayValue="name"
                                />

                            </Then>
                            <Else>
                                <CRow md={3}>
                                    <CFormLabel htmlFor="validationServer05">Sizes</CFormLabel>
                                    <CFormInput type="text" id="sizesInput" placeholder="Insert sizes comma sperated" required onChange={addSizes} />
                                    <CButton color="secondary" type="button" onClick={() => setSelectedSizes(i => values.map((val, idx) => { return { name: val, id: idx++ } }))} >
                                        Add
                                    </CButton>
                                </CRow>
                                {/* <CCol md={3}>
                                <CButton color="secondary" type="button" onClick={() => setSelectedSizes(i => values.map((val, idx) => { return { name: val, id: idx++ } }))} >
                                        Add
                                    </CButton>
                                  
                                </CCol> */}
                            </Else>
                        </If>
                        <div className="sizesContainer">
                            {selectedSizes.map((val, idx) =>
                                <div key={`size${idx}`} className="marginDiv sizesDiv"  >
                                    {/* <input type="text" id={`size${idx}`} defaultValue={val.name} key={`size${idx}`} /> */}
                                    <h5 className="sizeHead">{val.name}: </h5>
                                    <input type="number" id={val.name} key={`sizeQty${idx}`} placeholder="Quantity" onChange={updateSizes} />
                                </div>
                            )

                            }

                        </div>

                    </section>
                    <section className="discountSection">
                        <CFormCheck id="discount" label="Has Discount" onChange={e => setDiscount({ ...discount, hasDiscount: e.target.checked })} />
                        <br />
                        <input type={discount.hasDiscount ? 'number' : 'hidden'} placeholder="Insert discount rate" className="discountRate" step="0.01" onChange={e => setDiscount({ ...discount, discountRate: Number(e.target.value)})}/>
                    </section>


                    <CInputGroup className="mb-3">
                        <CFormInput type="file" id="image" multiple="multiple" onChange={e => console.log(e.target.files[0])} />
                    </CInputGroup>

                </section>

                <CButton type="submit" color="primary">
                    Submit
                </CButton>
            </form>
        </>

    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = { addProductHandler }
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);