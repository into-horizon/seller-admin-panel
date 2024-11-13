import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from "@coreui/react";
import logo from "../assets/images/Horozion-transparent.png";
import { AppSidebarNav } from "./AppSidebarNav";


import SimpleBar from "simplebar-react";

import 'simplebar-react/dist/simplebar.min.css';

// sidebar nav config
import navigation from "../_nav";
import { useTranslation } from "react-i18next";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow);
  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CImage src={logo} height={50} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() =>
          dispatch({ type: "set", sidebarUnfoldable: !unfoldable })
        }
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
