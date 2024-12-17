import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AuthLayout = () => {
  const { loggedIn } = useSelector((state) => state.login)

  if (loggedIn) {
    return <Navigate to={'/dashboard'} />
  }
  return <Outlet />
}

export default AuthLayout
