import React, { useState, useEffect } from 'react';
import {updateAddress,removeAddress} from '../../../store/address'
import {connect} from 'react-redux'
import {CCard,CButton,CCardHeader,CCardTitle,CCardText,CCardBody} from '@coreui/react'
import {
    AnimationType,
    DialogType,
    OutAnimationType,
    PopupProvider,
    usePopup,
    ToastPosition,
  } from 'react-custom-popup';

  const buttonStyles = {
    display: 'block',
    marginTop: 5,
  };
const ViewAddress = ({ address,updateAddress,removeAddress }) => {
    const { showAlert, showOptionDialog, showInputDialog, showToast } = usePopup();

    const updateAddressHandler = () => {
        showInputDialog({
            title: 'Sign Up',
            showCloseButton: true,
            headerTextStyle: { fontWeight: 'bold', fontSize: 'x-large' },
            headerStyle: { marginTop: 5, marginBottom: 5 },
            errorMessageStyle: { color: 'green' },
            options: [
              {
                name: 'No Thanks!',
                type: 'cancel',
                style: { background: 'lightcoral' },
              },
              {
                name: 'Cancel',
                type: 'cancel',
              },
              {
                name: 'Confirm',
                type: 'confirm',
                style: { background: 'lightgreen' },
              },
            ],
            inputs: [
              {
                inputType: 'text',
                name: 'first_name',
                label: 'First Name',
                default: address.first_name,
                validation: {
                  minLength: {
                    value: 5,
                  },
                },
              },
              {
                inputType: 'text',
                name: 'last_name',
                label: 'Last Name',
                default: address.last_name,
                validation: {
                  required: { value: true, message: 'Value is required' },
                },
              },
              {
                inputType: 'text',
                name: 'city',
                label: 'city',
                default: address.city,
                validation: { required: { value: true } },
              },
              {
                inputType: 'text',
                name: 'region',
                label: 'region',
                default: address.region,
                validation: { required: { value: true } },
              },
              {
                inputType: 'text',
                name: 'street_name',
                label: 'street',
                default: address.street_name,
                validation: { required: { value: true } },
              },
              {
                inputType: 'text',
                name: 'building_number',
                label: 'building',
                default: address.building_number,
               
              },
              {
                inputType: 'text',
                name: 'apartment_number',
                label: 'apartment',
                default: address.apartment_number,
               
              },
             
            ],
            onConfirm: (response) => {
                updateAddress({...address,...response})
              showAlert({ title: 'Result', text: JSON.stringify(response) });
            },
          })
    }
    useEffect(() => {
        console.log("🚀 ~ file: AddressRender.jsx ~ line 4 ~ ViewAddress ~ address", address)

    },[])
    return (
        <>
            <CCard>
                <CCardHeader>{address.storeName}</CCardHeader>
                <CCardBody>
                    <CCardTitle>{`${address.first_name} ${address.last_name}`}</CCardTitle>
                    <CCardText>{`${address.city} - ${address.region} - ${address.street_name}`}{ address.building_number && `- building:${address.building_number}`}{address.apartment_number && `- apartment:${address.apartment_number}`}</CCardText>
                    <CButton onClick={() =>updateAddressHandler()}>Update</CButton>
                   {' '} {' '}
                    <CButton color='danger' onClick={() =>removeAddress(address.id)}>Delete</CButton>
                </CCardBody>
            </CCard>
        </>
    )
}

const mapStateToProps = (state) => ({

})
const mapDispatchToProps = {updateAddress,removeAddress}
export default connect(mapStateToProps,mapDispatchToProps)(ViewAddress);