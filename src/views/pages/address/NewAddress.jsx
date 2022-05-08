import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons';
import { CButton, CForm, CFormInput, CCol, CRow, CContainer } from '@coreui/react'
import { addAddress } from '../../../store/address'
import { connect } from 'react-redux'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

const NewAddress = ({ addAddress }) => {

    console.log("🚀 ~ file: NewAddress.jsx ~ line 9 ~ addAddress", addAddress)
    const submitHandler = e => {
        e.preventDefault()
        let obj = {
            first_name: e.target.firstName.value,
            last_name: e.target.lastName.value,
            city: e.target.city.value,
            street_name: e.target.street.value,
            building_number: e.target.building.value,
            apartment_number: e.target.apartment.value,
            mobile: e.target.mobile.value,
            country: e.target.country.value,
            region: e.target.region.value,
            store_address: true,
        }
        addAddress(obj)
    }

    return (
        <>
            <CIcon icon={cilPlus} size="sm" />
            <CButton color="link" onClick={() => console.log('New Address')}>add new address</CButton>
            <CForm onSubmit={submitHandler}>
                <CContainer>
                    <CRow>
                        <CCol sm="auto">
                            <CFormInput
                                type="text"
                                name='first_name'
                                id="firstName"
                                label="first name"
                                placeholder="first name"
                                text="Must be 8-20 characters long."
                                aria-describedby="exampleFormControlInputHelpInline"
                                autocomplete="given-name"
                                required
                            />
                            <CFormInput
                                type="text"
                                name='last_name'
                                id="lastName"
                                label="last name"
                                placeholder="last name"
                                text="Must be 8-20 characters long."
                                aria-describedby="exampleFormControlInputHelpInline"
                                autocomplete="family-name"
                                required
                            />
                        </CCol>
                        <CCol sm="auto">
                            <CFormInput
                                type="city"
                                name='city'
                                id="city"
                                label="City"
                                placeholder="city"
                                text="Must be 8-20 characters long."
                                aria-describedby="exampleFormControlInputHelpInline"
                                autocomplete="home city"
                                required
                            />
                              <CFormInput
                                type="test"
                                id="region"
                                label="region"
                                placeholder="region"
                                text="Must be 8-20 characters long."
                                aria-describedby="exampleFormControlInputHelpInline"
                                autocomplete="address-level3"

                            />

                           
                        </CCol>

                        <CCol sm="auto">
                            <CFormInput
                                type="text"
                                name='street-address'
                                id="street"
                                label="street name"
                                placeholder="street name"

                                aria-describedby="exampleFormControlInputHelpInline"
                                autocomplete="street-address"
                                required
                            />
                            <CFormInput
                                type="text"

                                id="building"
                                label="Building Number/Name"
                                placeholder="Building Number/Name"

                                aria-describedby="exampleFormControlInputHelpInline"


                            />

                        </CCol>
                        <CCol sm="auto">
                            <CFormInput
                                type="text"

                                id="apartment"
                                label="apartment number"
                                placeholder="apartment number"

                                aria-describedby="exampleFormControlInputHelpInline"


                            />
                            <CFormInput
                                type="text"
                                name='phone'
                                id="mobile"
                                label="mobile"
                                placeholder="mobile"
                                text="Must be 8-20 characters long."
                                aria-describedby="exampleFormControlInputHelpInline"
                                autocomplete="tel"
                                required
                            />
                          
                            <CFormInput
                                type="hidden"
                                id="country"
                                label="Country"
                                placeholder="country"
                                text="Must be 8-20 characters long."
                                aria-describedby="exampleFormControlInputHelpInline"
                                autocomplete="country_name"
                                defaultValue='jordan'
                            />
                            
                        </CCol>


                    </CRow>
                    <CButton color="primary" style={{ margin: '1rem 0' }} type='submit'>Submit</CButton>
                </CContainer>
            </CForm>
        </>
    )
}
const mapStateToProps = (state) => ({

})

const mapDispatchToProps = { addAddress }

export default connect(mapStateToProps, mapDispatchToProps)(NewAddress);