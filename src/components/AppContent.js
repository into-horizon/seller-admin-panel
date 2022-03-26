import React, { useEffect,Suspense } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import cookie from 'react-cookies'
// routes config
import routes from '../routes'

const AppContent = () => {
const navigate = useNavigate()

useEffect(()=>{
    let currentPath = cookie.load('current_path')
    navigate(currentPath)
    if(window.location.pathname === '/'){
      navigate('/dashboard')

    }
  
},[])
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            const Item = route.component
            return (
              route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={ <Item/>
                   
                   
                    
                  }
                />
              )
            )
          })}
        </Routes>
          {/* <Navigate from="/" to="/dashboard" /> */}
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
