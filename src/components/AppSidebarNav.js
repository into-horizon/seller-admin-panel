import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CBadge } from "@coreui/react";
import { formatLocalizationKey } from "src/services/utils";

export const AppSidebarNav = ({ items }) => {
  const { t } = useTranslation("route");
  const pendingOrders = useSelector((state) => state.orders.pendingOrders);
  const { status } = useSelector((state) => state.login.user);
  const location = useLocation();
  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && t(formatLocalizationKey(name))}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  const navItem = (item, index) => {
    const { component, name, badge, icon, approved, ...rest } = item;
    const Component = component;
    return (
      (approved ? status === "approved" : true) && (
        <Component
          {...(rest.to &&
            !rest.items && {
              component: NavLink,
            })}
          key={index}
          {...rest}
        >
          {navLink(name, icon, badge)}
        </Component>
      )
    );
  };
  const navGroup = (item, index) => {
    const { component, name, icon, to, approved, ...rest } = item;
    const Component = component;
    return (
      (approved ? status === "approved" : true) && (
        <Component
          idx={String(index)}
          key={index}
          toggler={navLink(name, icon)}
          visible={location.pathname.startsWith(to)}
          {...rest}
        >
          {item.items?.map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index)
          )}
        </Component>
      )
    );
  };

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
    </React.Fragment>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};
