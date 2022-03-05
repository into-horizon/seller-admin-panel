import React, { useState, useEffect } from 'react';
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import ProductsRender from 'src/components/ProductsRender';
import cookie from 'react-cookies'
const Products = props => {
    const [activeKey, setActiveKey] = useState(cookie.load('status') || 'approved')


    const changeStatus = (e,status) =>{
        e.preventDefault();
        setActiveKey(status)
        cookie.save('status', status)
    }
    return (
        <div className="products">
            <h3>Your Products</h3>
            <CNav variant="pills" role="tablist">
                <CNavItem>
                    <CNavLink
                        href=""
                        active={activeKey === 'approved'}
                        onClick={(e) => changeStatus(e, 'approved')}
                     

                    >
                       Approved
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        href=""
                        active={activeKey === 'pending'}
                        onClick={(e) => changeStatus(e, 'pending')}
                    >
                        Pending
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        href=""
                        active={activeKey === 'rejected'}
                        onClick={(e) => changeStatus(e, 'rejected')}
                    >
                        Rejected
                    </CNavLink>
                </CNavItem>
            </CNav>
            <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 'approved'}>
                {activeKey === 'approved'? <ProductsRender status= {activeKey}/>: null}
                </CTabPane>
                <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 'pending'}>
                {activeKey === 'pending'? <ProductsRender status= {activeKey}/>: null}
                </CTabPane>
                <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 'rejected'}>
                {activeKey === 'rejected'? <ProductsRender status= {activeKey}/>: null}
                </CTabPane>
            </CTabContent>
        </div>
    )
}

export default Products