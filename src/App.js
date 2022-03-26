import React, { Component, useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import { PopupProvider } from "react-custom-popup";
import { getUser } from "./store/auth"
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux"
import cookie from 'react-cookies';
import { If, Then, Else } from 'react-if'
import { useTranslation } from 'react-i18next';
import { Rings } from 'react-loader-spinner'
import { getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler } from './store/category'
import { current } from '@reduxjs/toolkit';


const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Verify = React.lazy(() => import('./views/pages/verify/verify'))

const App = props => {
  const navigate = useNavigate()

  const { getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler } = props
  const { t, i18n } = useTranslation();
  const [load, setLoad] = useState(true)
  let token = cookie.load('access_token')
  let currentPath = cookie.load('current_path')
  useEffect(() => {
    getParentCategoriesHandler()
    getChildCategoriesHandler()
    getGrandChildCategoriesHandler()

    let lang = localStorage.getItem('i18nextLng')
    if (lang === 'en') {
      i18n.changeLanguage(lang);
      document.documentElement.setAttribute("lang", 'en');
      document.documentElement.setAttribute("dir", 'ltl');
    } else {
      i18n.changeLanguage(lang);
      document.documentElement.setAttribute("lang", 'ar');
      document.documentElement.setAttribute("dir", 'rtl');
    }

    if (!props.login.user.id && token) {
      props.getUser()

    }


  }, [])

  useEffect(() => {

    if (props.login.loggedIn && props.login.user.id && props.login.user.verified_email) {
      navigate(currentPath === '/login' ? '/' : currentPath)
      setLoad(false)
    } else if (!props.login.loggedIn && !token && !props.login.user.id) {
      let path =  cookie.load('current_path') === '/register'? cookie.load('current_path'): '/login'
      cookie.save('current_path', path, {path: '/'})
      navigate(path)
      setLoad(false)
    } else if (!props.login.user.verified_email){
      navigate('/verify')
      setLoad(false)
    }

  }, [props.login.loggedIn, props.login.user])

  return (
    <PopupProvider>

      <React.Suspense fallback={loading}>

        {load && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Rings height='35rem' width='150' />
        </div>}

        {!load && <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route
            exact
            path="/register"
            name="Register Page"
            element={<Register />}
          />
          <Route exact path='/verify' name='verify' element={<Verify/>}></Route>
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/404" name="Page 404" element={<Page404 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>}
      </React.Suspense>


    </PopupProvider>
  )

}

const mapStateToProps = (state) => ({
  login: state.login

});
const mapDispatchToProps = { getUser, getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler };
export default connect(mapStateToProps, mapDispatchToProps)(App)
