import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import './scss/style.scss'
import { PopupProvider } from 'react-custom-popup'
import { checkAPIServer, getUser } from './store/auth'
import { useNavigate } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import cookie from 'react-cookies'
import { useTranslation } from 'react-i18next'
import { Rings } from 'react-loader-spinner'
import {
  getParentCategoriesHandler,
  getChildCategoriesHandler,
  getGrandChildCategoriesHandler,
  getCategories,
} from './store/category'
import { getAddress } from './store/address'
import GlobalToast from './components/Toast'
import GlobalDialog from './components/Dialog'
import { CCol, CContainer, CRow } from '@coreui/react'
import * as buffer from 'buffer'
import Auth from './services/Auth'
import './socket'
import routes from './routes'
import AuthLayout from './layout/AuthLayout'
window.Buffer = buffer.Buffer

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Verify = React.lazy(() => import('./views/pages/verify/verify'))
const Reference = React.lazy(() => import('./views/pages/password/reference'))
const ResetPassword = React.lazy(() => import('./views/pages/password/ResetPassword'))

const App = () => {
  const {
    user: { status },
    isUserLoading,
    globalLoader,
    isServerDown,
  } = useSelector((state) => state.login)
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  useEffect(() => {
    if (i18n.language === 'ar') {
      document.documentElement.setAttribute('lang', 'ar')
      document.documentElement.setAttribute('dir', 'rtl')
    } else {
      document.documentElement.setAttribute('lang', 'en')
      document.documentElement.setAttribute('dir', 'ltl')
      i18n.changeLanguage('en')
    }
  }, [i18n.language])

  const Loading = () => (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs="auto">
            <Rings height="35rem" width="150" color="blue" />
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
  useEffect(() => {
    dispatch(checkAPIServer())
  }, [])
  useEffect(() => {
    if (isServerDown) {
      navigate('/500')
    } else {
      navigate('/')
    }
  }, [isServerDown])

  if (isUserLoading || globalLoader) {
    return <Loading />
  }
  return (
    <PopupProvider>
      <GlobalToast />
      <GlobalDialog />
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to={'login'} />} />
            <Route path="login" name="Login Page" element={<Login />} />
            <Route path="register" name="Register Page" element={<Register />} />
            <Route path="reference" name="reference" element={<Reference />} />
            <Route path="resetPassword/:token" name="password reset" element={<ResetPassword />} />
          </Route>
          <Route path="/" name="Home" element={<DefaultLayout />}>
            <Route index element={<Navigate to={'dashboard'} />} />
            {routes.map((route, idx) => {
              const Item = route.component
              return (
                route.component &&
                (route.approved ? route.approved && status === 'approved' : true) && (
                  <Route
                    key={`route${idx}`}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<Item />}
                  />
                )
              )
            })}
          </Route>
          <Route exact path="/verify" name="verify" element={<Verify />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Page 404" element={<Page404 />} />
        </Routes>
      </React.Suspense>
    </PopupProvider>
  )
}

export default App
