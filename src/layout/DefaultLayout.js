import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { storeSocket } from 'src/socket'
import { getNotifications, resetNotifications } from 'src/store/notifications'

const DefaultLayout = () => {
  const { user } = useSelector((state) => state.login)
  const dispatch = useDispatch()
  storeSocket.emit('populate-store', user)
  storeSocket.on('triggerNotification', () => {
    dispatch(resetNotifications())
    dispatch(getNotifications({ limit: 5, offset: 0 }))
  })
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
