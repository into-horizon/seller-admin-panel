import React , { useState, useEffect } from 'react';
import AddressRender from './AddressRender'
import NewAddress from './NewAddress'
import {connect} from 'react-redux'
import {getAddress} from '../../../store/address'
const Address = ({getAddress,address,message,storeName}) =>{
    const [storeAddress,setAddress] = useState({})
    useEffect(() => {
        getAddress()
    },[])
    useEffect(() => {
        setAddress(address)
        
    },[address])
    return(
        <>
        {/* <AddressRender/> */}
       {storeAddress.id? <AddressRender address={{...storeAddress, storeName: storeName}}/>: <NewAddress/>}
        </>
    )
}
const mapStateToProps = (state) => ({
    address: state.address.address,
    message: state.address.message,
    storeName: state.login.user.store_name
})
const mapDispatchToProps = {getAddress}
export default connect(mapStateToProps,mapDispatchToProps)(Address);