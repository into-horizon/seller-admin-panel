import React, { useState, useEffect } from "react";
import { CButton, CNav, CNavItem, CNavLink } from "@coreui/react";
import Account from "./account/Account";
import Address from "./address/Address";
import { useTranslation } from "react-i18next";
import BankAccount from "./transfer-account/BankAccount";

const Settings = (props) => {
  const [activeKey, setActiveKey] = useState("address");
  const { t } = useTranslation("settings");
  return (
    <>
      <CNav variant="pills">
        <CNavItem>
          <CNavLink
            as={CButton}
            active={activeKey === "address"}
            onClick={() => setActiveKey("address")}
          >
            {t("address")}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            as={CButton}
            active={activeKey === "payment"}
            onClick={() => setActiveKey("payment")}
          >
            {t("payment")}
          </CNavLink>
        </CNavItem>
      </CNav>
      {activeKey === "address" && <Address />} 
      {activeKey === "payment" && <BankAccount />}
    </>
  );
};

export default Settings;
