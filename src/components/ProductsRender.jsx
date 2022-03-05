import React, { useState, useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { CPaginationItem, CPagination, CButton } from '@coreui/react'
import { getProductsByStatusHandler, addProductPictureHandler, deleteProductPictureHandler } from 'src/store/product';
import { If, Then, Else } from 'react-if'
import cookie from 'react-cookies';

const ProductsRender = props => {
    const products = useSelector(state => state.products)
    const [currentProducts, setCurrentProducts] = useState({})
    const [pages, setPages] = useState([])
    const [selectedPage, setSelectedPage] = useState(Number(cookie.load('selectedPage')) || 1)

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

    return (
        <div className="productsRender">
            {currentProducts.products?.map((product, idx) =>
                <div key={product.entitle + idx}>
                    {console.log("🚀 ~ file: ProductsRender.jsx ~ line 87 ~ product", product.id)}
                    <h3 className="productTitle">{product.entitle}</h3>
                    <div className="productPictures">
                        {[...product.pictures, ...completeArray(product.pictures.length)]?.map((picture, i) =>
                            <div key={picture.id + Math.random()}>
                                <If condition={picture.product_picture}>
                                    <Then>
                                        <CButton color="light" className="deleteBtn" onClick={() => props.deleteProductPictureHandler({ picture_id: picture.id })}>X</CButton>
                                        <img src={picture.product_picture} alt="" />

                                    </Then>
                                    <Else>

                                        <input type="file" id={product.id} hidden onChange={(e)=> addProductPicture(e,product.id)} />
                                        {/* <input type="file" id="upload" hidden onChange={(e) => console.log(e, product.id)} /> */}

                                        {/* {                                        console.log("🚀 ~ file: ProductsRender.jsx ~ line 72 ~ product.id", product.id) */}
                                        <label htmlFor={product.id} className="uploadLabel">Choose file</label>

                                    </Else>
                                </If>

                            </div>
                        )}
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