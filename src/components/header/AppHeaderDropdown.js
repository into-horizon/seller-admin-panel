import React, { useEffect, useState } from "react";
import {
  CAvatar,
  CBadge,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import { cilLockLocked, cilSettings, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import cookie from "react-cookies";
import { Link } from "react-router-dom";

import { logout } from "src/store/auth";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { formatLocalizationKey } from "src/services/utils";

const AppHeaderDropdown = (props) => {
  const [token, setToken] = useState("");
  const { login, logout } = props;
  const { t } = useTranslation(["route", "profile"]);
  useEffect(() => {
    setToken((t) => cookie.load("access_token"));
  }, []);
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={login.user.store_picture} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2 d-flex">
          {t(formatLocalizationKey('Account'))}
        </CDropdownHeader>
        <Link to="/profile" className="dropdown-item d-flex">
          <CIcon icon={cilUser} className="me-2" />
          {t(formatLocalizationKey("Profile"))}
        </Link>
        <Link to="/settings" className="dropdown-item d-flex" >
          <CIcon icon={cilSettings} className="me-2" />
          {t(formatLocalizationKey("Settings"))}
        </Link>
        <CDropdownDivider />
        <CDropdownItem
          as={CButton}
          onClick={() => {
            logout();
          }}
          className="d-flex"
        >
          <CIcon icon={cilLockLocked} className="me-2" />
          {t(formatLocalizationKey('Logout'))}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};
const mapStateToProps = (state) => ({
  login: state.login,
});
const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(AppHeaderDropdown);
