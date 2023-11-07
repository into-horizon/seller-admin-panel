import React, { useState, useEffect, Children} from 'react';
import { useLocation } from "react-router-dom";
import { connect, useSelector, useDispatch } from 'react-redux'
import { CFormSelect, CFormLabel, CFormText, CFormCheck, CFormInput, CButton, CFormFloating, CFormTextarea, CFormFeedback, CCol, CForm, CRow, CInputGroup, CInputGroupText, CSpinner } from '@coreui/react'
import { usePopup, DialogType, AnimationType, ToastPosition } from "react-custom-popup";
import { getSearchDataHandler, getSearchedProductHandler, updateProductHandler } from "../../store/product"
import { useTranslation } from 'react-i18next';
import { addProductHandler, errorMessage } from 'src/store/product';
import Select from "react-dropdown-select";

const UpdateProduct = (props) => {
    const { showOptionDialog, showToast, showAlert } = usePopup();
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation('product');
    const { message, currentProducts:{count, products,searchData,searched},  } = useSelector(state => state.products)
    const {parentCategories,childCategories, grandChildCategories} = useSelector(state => state.category)
    let sizeSymbols = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    let sizeNumbers = []
    if (sizeNumbers.length === 0) {
        for (let i = 30; i <= 50; i++) {
            sizeNumbers.push(i)
        }

    }
    const { getSearchDataHandler, getSearchedProductHandler, addProductHandler, updateProductHandler } = props
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");
    const initialState = {
        values: [],
        secondCategory: { visible: false },
        thirdCategory: { visible: false, selected: false, add: false, select: true, data:[] },
        sizes: { visible: false, add: false },
        selectedSizes: [],
        sizesDetails: [],
        discount: { hasDiscount: false, discountRate: 0 }
    }

    const [secondCategory, setSecondCategory] = useState({ visible: true, data: [...childCategories] })
    const [thirdCategory, setThirdCategory] = useState({ visible: true, selected: false, add: false, select: true, data: [...grandChildCategories] })


    const changeHandler = product => {
        if (product[0]) {
            setLoading(true);
            getSearchedProductHandler(product[0].id).then(()=> setLoading(false))

        }
    }


    const submitHandler = (e, id) => {
        e.preventDefault();
        let obj = {
            id: id,
            entitle: e.target.entitle.value,
            artitle: e.target.artitle.value,
            metaTitle: e.target.metatitle.value,
            sku: e.target.sku.value,
            price: Number(e.target.price.value),
            brand_name: e.target.brandName.value,
            endescription: e.target.endescription.value,
            ardescription: e.target.ardescription.value,
            parent_category_id: e.target.parentCategory.value,
            child_category_id: e.target.childCategory.value,
            grandchild_category_id: e.target.grandChildCategory? e.target.grandChildCategory.value === 'default' ? null : e.target.grandChildCategory.value: null,
        }
        showOptionDialog({
            containerStyle: { width: 350 },
            text: "Updating your product will change its status to `Pending`",
            title: 'Updating Product?',
            options: [
              {
                name: 'Cancel',
                type: 'cancel',
              },
              {
                name: 'Update',
                type: 'confirm',
                style: { background: 'lightcoral' },
              },
            ],
            onConfirm: () =>
            updateProductHandler(obj)
              
          })
        // console.log("🚀 ~ file: UpdateProducts.jsx ~ line 69 ~ submitHandler ~ obj", obj)

        // updateProductHandler(obj)

    }
    const categoryVisibility = e => {
        setSecondCategory(x => {return{...x,visible: true, data: childCategories.filter(val=> val.parent_id === e.target.value)}})
        setThirdCategory(initialState.thirdCategory)
    }
    const categoryVisibility2 = e => {
       
        setThirdCategory(x=> {return{ ...x, visible: true, data: grandChildCategories.filter(val=> val.parent_id === e.target.value) } })
    }

    useEffect(() => {
        getSearchDataHandler(['approved', 'rejected'])
        if (id) {
            getSearchedProductHandler(id)
        }
        
    }, [])
    useEffect(() => {
        if (searchData) {
            setOptions(searchData.map(val => { return { name: val[`${i18n.language}title`], id: val.id, key: val.id, value: val.id } }))

        }
    }, [searchData, i18n.language])
   
    useEffect(() => {
        let labels = document.querySelectorAll('#label')
        if (i18n.language === 'ar') {
            labels.forEach(label => label.setAttribute('class', 'rightBorder'))
        } else if (i18n.language === 'en') {
            labels.forEach(label => label.setAttribute('class', 'leftBorder'));
        }
    }, [searched, i18n.language])
    useEffect(() => {
        if(message){
            if(message && message.includes('updated')){
                showToast({
                    type: DialogType.SUCCESS,
                    text: 'updated successfully',
                    timeoutDuration: 3000,
                    showProgress: true,
                    position: ToastPosition[t('position')]
                })
            }
        }
        dispatch(errorMessage({ message: '' }))
    },[message])
    useEffect(()=>{
        setSecondCategory(x=>{return{...x, data: childCategories.filter(val=> val.parent_id === searched.parent_category_id)}})
        setThirdCategory(x=>{return{...x, data: childCategories.filter(val=> val.parent_id === searched.child_category_id)}})
    }, [searched])
    return (
        <div className="r">
            <h2>update product</h2>
            <div style={{ width: '50%', margin: 'auto' }}>
                <Select options={options} onChange={changeHandler} labelField='name' searchable={true} searchBy='name' direction='auto' loading={loading} />
            </div>
          { loading ? <CSpinner color='primary'/> :  <div>
                {searched?.id && <form id='productForm' className="productForm" onSubmit={e => submitHandler(e, searched.id)}>
                    <section className="productInputs">
                        <div>
                            <label>{t('englishTitle')}*</label>
                            <input type="text" id="entitle" placeholder={t('englishTitle')} required defaultValue={searched.entitle} />
                        </div>
                        <div>
                            <label id="label">{t('arabicTitle')}*</label>
                            <input type="text" id="artitle" placeholder={t('arabicTitle')} required defaultValue={searched.artitle} />
                        </div>
                        <div>
                            <label id="label">{t('metaTitle')}</label>
                            <input type="text" id="metatitle" placeholder={t('metaTitle')} defaultValue={searched.metaTitle} />
                        </div>
                        <div>
                            <label >SKU</label>
                            < input type="text" id="sku" placeholder="SKU" defaultValue={searched.sku} />
                        </div>
                        <div>
                            <label id="label">{t('price')}*</label>
                            < input type="number" id="price" placeholder={t('price')} step='0.01' required defaultValue={searched.price} />
                        </div>
                        <div>
                            <label id="label">{t('brandName')}</label>
                            <input type="text" id="brandName" placeholder={t('brandName')} defaultValue={searched.brand_name} />
                        </div>

                    </section>
                    <div className='marginDiv'>
                        <div className='description'>

                            <CFormFloating>
                                <CFormTextarea
                                    placeholder="Leave a comment here"
                                    id="endescription"
                                    style={{ height: '100px' }}
                                    defaultValue={searched.endescription}
                                ></CFormTextarea>
                                <CFormLabel htmlFor="floatingTextarea2" value={searched.endescription} required>{t('englishDescrition')}*</CFormLabel>
                            </CFormFloating>
                            <CFormFloating>
                                <CFormTextarea
                                    placeholder="Leave a comment here"
                                    id="ardescription"
                                    defaultValue={searched.ardescription}
                                    style={{ height: '100px' }}
                                ></CFormTextarea>
                                <CFormLabel htmlFor="floatingTextarea3" required>{t('arabicDescription')}*</CFormLabel>
                            </CFormFloating>

                        </div>

                    </div>
                    <div className='marginDiv'>
                        <CFormSelect aria-label="Default select example" required onChange={categoryVisibility} id='parentCategory' defaultValue={searched.parent_category_id} >
                            <option value='default'>{t('parentCategory')}</option>
                            {Children.toArray(parentCategories.map((val) =>
                                <option value={val.id} >{val[`${i18n.language}title`]}</option>
                            ))

                            }

                        </CFormSelect>
                    </div>
                    <div className='marginDiv'>
                        <CFormSelect aria-label="Default select example" disabled={!secondCategory.visible} onChange={categoryVisibility2} id='childCategory' defaultValue={searched.child_category_id}>
                            <option value='default'>{t('childCategory')}</option>

                           {Children.toArray(secondCategory.data.map((val) =>
                                <option value={val.id}>{val[`${i18n.language}title`]}</option>
                            ))

                               }
                        </CFormSelect>
                    </div>

                    <section className="TCS" >
                        <section>
                            <CFormCheck id="flexCheckDefault" label={t('selectOrAdd')} onChange={e => setThirdCategory({ ...thirdCategory, selected: e.target.checked })} checked={(searched.grandChild_category? true: false || thirdCategory.selected)} disabled={thirdCategory.data.length === 0}/>
                        </section>
                       {(thirdCategory.data.length > 0|| thirdCategory.selected) && <section style={{  width: '20%' }}>
                            <section>
                                <CFormCheck type="radio" name="TC" id="TC1" label={t('selectThird')} defaultChecked onChange={e => setThirdCategory({ ...thirdCategory, select: !thirdCategory.select, add: !thirdCategory.add })} />

                            </section>
                            <section>

                                <CFormCheck type="radio" name="TC" id="TC2" label={t('addOwn')} onChange={e => setThirdCategory({ ...thirdCategory, select: !thirdCategory.select, add: !thirdCategory.add })} disabled />
                            </section>

                            <CFormSelect aria-label="Default select example" id='grandChildCategory' disabled={!thirdCategory.visible} style={{ display: thirdCategory.select ? 'inherit' : 'none' }} defaultValue={searched.grandChild_category?.id}>
                                <option value='default'>{t('grandChildCategory')}</option>

                                {Children.toArray(thirdCategory.data.map((val) =>
                                    <option value={val.id}>{val[`${i18n.language}title`]}</option>
                                ))

                                   }
                            </CFormSelect>


                            <input type={thirdCategory.add ? 'text' : 'hidden'} placeholder={t('addOwn')} className='thirdCategory' disabled={!thirdCategory.visible} id='addGrandChildCategory' />
                        </section>}


                    </section>

                    <CButton type="submit" color="primary">
                        {t('submit')}
                    </CButton>
                </form>}
            </div>}
        </div>
    )
}

const mapDispatchToProps = { getSearchDataHandler, getSearchedProductHandler, addProductHandler, updateProductHandler }
export default connect(null, mapDispatchToProps)(UpdateProduct)