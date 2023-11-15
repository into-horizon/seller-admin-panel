import React from "react";
import CIcon from "@coreui/icons-react";
import { cilPuzzle, cilSpeedometer, cilCart, cilMoney } from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Components",
  },
  {
    component: CNavGroup,
    name: "Products",
    to: "/product",
    approved: true,
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Add Product",
        to: "/product/add",
      },
      {
        component: CNavItem,
        name: "Products",
        to: "/product/products",
      },
      {
        component: CNavItem,
        name: "Update Product",
        to: "/product/updateProduct",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Orders",
    to: "/order",
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Pending Orders",
        to: "/order/pendingOrders",
        approved: true,
      },
      {
        component: CNavItem,
        name: "Orders Overview",
        to: "/order/overview",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Finance",
    to: "/finance",
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Statement",
        to: "/finance/statement",
      },
      {
        component: CNavItem,
        name: "Summary",
        to: "/finance/summary",
      },
    ],
  },
];

export default _nav;
