import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormLabel
} from '@coreui/react'
import { loginHandler, deleteMessage } from '../../../store/auth'
import { Link } from 'react-router-dom';
import { usePopup, DialogType } from "react-custom-popup";
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilApplications, cilLocationPin, cilDescription, cilShortText, cilImagePlus } from '@coreui/icons'
import { createStoreHandler } from '../../../store/auth'
import { connect, useSelector, useDispatch } from 'react-redux'
import cookie from 'react-cookies'


const Register = (props) => {
  const dispatch = useDispatch()
  const { showAlert } = usePopup();
  const { user, message, loggedIn } = useSelector((state) => state.login)
  const { createStoreHandler } = props
  const submitHandler = e => {
    e.preventDefault();
    let obj = {
      store_name: e.target.storeName.value,
      email: e.target.email.value,
      city: e.target.city.value,
      mobile: e.target.mobile.value,
      caption: e.target.caption.value,
      about: e.target.about.value,
    }
    let formData = new FormData();
    console.log("🚀 ~ file: Register.js ~ line 42 ~ Register ~ e.target.formFile.files[0]", e.target.formFile.files[0])
    if (e.target.formFile.files[0]) {
      formData.append('image', e.target.formFile.files[0], e.target.formFile.files[0].name)
    }
    Object.entries(obj).forEach(([key, value]) => {
      if (value === null) {
        return
      } else {
        formData.append(key, value)
      }
    }
    )
    createStoreHandler(formData)
  }

  useEffect(() => {
    if (message) {
      if (message.includes('not')) {
        showAlert({
          title: message,
          type: DialogType.WARNING,
          text: `there's no account associated with this email`
        });
      } else if (message.includes('exists')) {
        if (message) {
          showAlert({
            title: message,
            type: DialogType.WARNING,
            text: 'you already have a seller account associated with this email'
          });
        }
      }
      dispatch(deleteMessage())
    }
  }, [message])

  useEffect(() => {
    cookie.save('current_path', window.location.pathname, {path: '/'})
  }, [])
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={submitHandler}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Store Name" id="storeName" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Your horizon account email" autoComplete="email" id='email' />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLocationPin} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="City"
                      autoComplete="home city"
                      value="Amman"
                      readOnly
                      id="city"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilApplications} />
                    </CInputGroupText>
                    <CFormInput
                      type="tel"
                      placeholder="Mobile Number"
                      autoComplete="phone"
                      id="mobile"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Caption"
                      id='caption'
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilShortText} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="About"
                      id='about'
                    />
                  </CInputGroup>
                  <CFormLabel htmlFor="formFile">Choose a picture to your store</CFormLabel>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilImagePlus} />
                    </CInputGroupText>
                    <CFormInput type="file" id="formFile" />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="success">Create Account</CButton>
                  </div>
                </CForm>
                <div style={{ margin: '1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ margin: '0 1rem'}}>

                    you already have an account
                  </span>
                  <Link to='/login' style={{textDecoration: 'none'}}>
                    <strong>

                    login
                    </strong>
                  </Link>

                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = { createStoreHandler }
export default connect(mapStateToProps, mapDispatchToProps)(Register)
