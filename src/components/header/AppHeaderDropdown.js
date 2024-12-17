import React, { memo } from 'react'
import {
  CAvatar,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Link } from 'react-router-dom'

import { logout } from 'src/store/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formatLocalizationKey } from 'src/services/utils'
const MemoizedAvatar = React.memo(CAvatar)

const AppHeaderDropdown = () => {
  const { t } = useTranslation(['route', 'profile'])
  const dispatch = useDispatch()
  const {
    user: { store_picture },
  } = useSelector((state) => state.login)
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar key={store_picture} src={store_picture} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2 d-flex">
          {t(formatLocalizationKey('Account'))}
        </CDropdownHeader>
        <Link to="/profile" className="dropdown-item d-flex">
          <CIcon icon={cilUser} className="me-2" />
          {t(formatLocalizationKey('Profile'))}
        </Link>
        <Link to="/settings" className="dropdown-item d-flex">
          <CIcon icon={cilSettings} className="me-2" />
          {t(formatLocalizationKey('Settings'))}
        </Link>
        <CDropdownDivider />
        <CDropdownItem as={CButton} onClick={() => dispatch(logout())} className="d-flex">
          <CIcon icon={cilLockLocked} className="me-2" />
          {t(formatLocalizationKey('Logout'))}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
