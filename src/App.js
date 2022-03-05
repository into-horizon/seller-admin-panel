import React, { Component, useEffect, useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import './scss/style.scss'
import { PopupProvider } from "react-custom-popup";
import { getUser } from "./store/auth"
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux"
import cookie from 'react-cookies';
import { If, Then, Else } from 'react-if'
import { useTranslation } from 'react-i18next';
import { Rings } from 'react-loader-spinner'
import {getParentCategoriesHandler,getChildCategoriesHandler,getGrandChildCategoriesHandler} from './store/category'


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

const App = props => {
  const history = useHistory()
 
  const {getParentCategoriesHandler,getChildCategoriesHandler,getGrandChildCategoriesHandler} = props
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
      // setLoading(i =>!loading)
    } else {
      i18n.changeLanguage(lang);
      document.documentElement.setAttribute("lang", 'ar');
      document.documentElement.setAttribute("dir", 'rtl');
      // setLoading(i =>!loading)
    }
   
    if (!props.login.user.id && token) {
      props.getUser()
      // history.push(currentPath || '/')
      //  setLoad(false)
    }
    // else {
      //   history.push('/login')
    //   setLoad(false)
    // }
    
  }, [])
  
  useEffect(() => {
   
    if (props.login.loggedIn) {
      // props.getUser(token)
      history.push(currentPath || '/')
       setLoad(false)
    }else if (!props.login.loggedIn && !token) {
      history.push('/login')
      setLoad(false)
    } 
    // else{
    //   setLoad(false)
    // }
  },[props.login.loggedIn, props.login.user])

  return (
    <PopupProvider>
      <HashRouter>
            <React.Suspense fallback={loading}>
      <If condition={load}>
        <Then>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100hv', width: '100wh'}}>
            <Rings />
          </div>
        </Then>
        <Else>
              <Switch>
                <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
                <Route
                  exact
                  path="/register"
                  name="Register Page"
                  render={(props) => <Register {...props} />}
                />
                <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
                <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
                <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />
              </Switch>
        </Else>
      </If>
            </React.Suspense>
          </HashRouter>

    </PopupProvider>
  )

}

const mapStateToProps = (state) => ({
  login: state.login

});
const mapDispatchToProps = { getUser,getParentCategoriesHandler,getChildCategoriesHandler,getGrandChildCategoriesHandler };
export default connect(mapStateToProps, mapDispatchToProps)(App)
