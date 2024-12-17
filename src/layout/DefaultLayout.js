import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppSidebar, AppFooter, AppHeader } from '../components/index'
import { storeSocket } from 'src/socket'
import { getNotifications, resetNotifications } from 'src/store/notifications'
import { CContainer } from '@coreui/react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { getAddress } from 'src/store/address'
import { getCategories } from 'src/store/category'

const DefaultLayout = () => {
  const { user, loggedIn } = useSelector((state) => state.login)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  storeSocket.emit('populate-store', user)
  storeSocket.on('triggerNotification', () => {
    dispatch(resetNotifications())
    dispatch(getNotifications({ limit: 5, offset: 0 }))
  })

  useEffect(() => {
    if (loggedIn) {
      dispatch(getAddress())
      dispatch(getCategories())
    } else if (loggedIn && !user.verified_email) {
      navigate('/verify')
    }
  }, [loggedIn, user.verified_email])

  if (!loggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <CContainer lg>
            <Outlet />
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
