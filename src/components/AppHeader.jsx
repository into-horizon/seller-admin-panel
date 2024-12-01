import React, { Children, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CButton,
  CBadge,
  CListGroup,
  CListGroupItem,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import { useTranslation } from 'react-i18next'
import { formatLocalizationKey, localizedDate, localizedTime } from 'src/services/utils'
import { getNotifications, updateNotifications } from 'src/store/notifications'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow)
  const { t, i18n } = useTranslation(['route', 'global'])
  const [params, setParams] = useState({ limit: 5, offset: 0 })
  const [visibleList, setVisibleList] = useState(false)
  const notificationsContainer = useRef()
  const { data: notifications, count, isLoading } = useSelector((state) => state.notifications)
  useEffect(() => {
    dispatch(getNotifications(params))
    const handleClose = (e) => {
      if (!notificationsContainer?.current?.contains(e.target)) {
        setVisibleList(false)
      }
    }
    document.addEventListener('click', handleClose)
    return () => {
      document.removeEventListener('click', handleClose)
    }
  }, [])
  useEffect(() => {
    if (visibleList && count > 0) {
      dispatch(updateNotifications())
    }
  }, [visibleList])
  const handleClick = (e) => {
    e.stopPropagation()
    setParams((oldParams) => {
      const newParams = {
        ...oldParams,
        offset: (oldParams.offset + 1) * oldParams.limit,
      }
      dispatch(getNotifications(newParams))
      return newParams
    })
  }
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              {t(formatLocalizationKey('Dashboard'))}
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/settings" component={NavLink}>
              {t(formatLocalizationKey('Settings'))}
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CButton
          color="primary"
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
          className=" mx-3 "
        >
          {t('lang', { ns: 'global' })}
        </CButton>
        <CHeaderNav>
          <CNavItem className="position-relative" ref={notificationsContainer}>
            <CNavLink
              component={CButton}
              className="position-relative py-1 btn-light"
              onClick={() => setVisibleList(!visibleList)}
            >
              <CIcon icon={cilBell} size="xl" />
              {!isLoading && (
                <CBadge
                  color="danger"
                  position={i18n.language === 'en' ? 'top-end' : 'top-start'}
                  shape="rounded-pill"
                >
                  {count > 0 && count}
                </CBadge>
              )}
            </CNavLink>
            {visibleList && (
              <CListGroup
                className={`position-absolute ${
                  i18n.language === 'en' ? 'end-0' : 'start-0'
                } notifications-list`}
              >
                {Children.toArray(
                  notifications.map((notification) => (
                    <CListGroupItem
                      className={`d-flex row justify-content-end m-0 ${
                        notification.seen ? '' : 'bg-light'
                      }`}
                    >
                      <p className="col-12 m-0">{notification[`${i18n.language}_message`]} </p>
                      <sub className="col-auto p-2 m-0">
                        {new Date(notification.created_at).toDateString() ===
                        new Date().toDateString()
                          ? localizedTime(notification.created_at, i18n.language)
                          : localizedDate(notification.created_at, i18n.language)}
                      </sub>
                    </CListGroupItem>
                  )),
                )}
                {notifications.length === 0 && !isLoading && (
                  <CListGroupItem>{t('NO_NOTIFICATIONS', { ns: 'global' })}</CListGroupItem>
                )}
                {!isLoading && (
                  <CListGroupItem component={CButton} className=" btn-light" onClick={handleClick}>
                    {t(formatLocalizationKey('Show More'), { ns: 'global' })}
                  </CListGroupItem>
                )}
                {isLoading && (
                  <CListGroupItem className="d-flex justify-content-center ">
                    <CSpinner color="primary" className="m-auto" />
                  </CListGroupItem>
                )}
              </CListGroup>
            )}
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
