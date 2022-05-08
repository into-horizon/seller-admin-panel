import React, { useState, useEffect } from 'react'
import {CNav,CNavItem ,CNavLink} from '@coreui/react'
import Account from '../../../components/Account'
import Address from '../address/Address'
const Settings = props => {
    const [activeKey, setActiveKey] = useState('settings')

    const changeStatus = (e,status) =>{
        e.preventDefault();
        setActiveKey(status)
      
    }
    return (
        <>
            <CNav variant="pills">
                <CNavItem>
                    <CNavLink href="#" active={activeKey === 'settings'} onClick={() => setActiveKey('settings')}>
                        Account Settings
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href="#" active={activeKey === 'address'} onClick={() => setActiveKey('address')}>Address</CNavLink >
                </CNavItem>
                {/* <CNavItem>
                    <CNavLink href="#" active={}>Link</CNavLink>
                </CNavItem> */}
                <CNavItem>
                    <CNavLink href="#" active={activeKey === 'payment'} disabled onClick={() => setActiveKey('payment')}>
                        Payment
                    </CNavLink>
                </CNavItem>
            </CNav>
                {activeKey === 'settings' && <Account/>}
                {activeKey === 'address' && <Address/>}

        </>
    )
}

export default Settings