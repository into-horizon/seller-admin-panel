import React, { useState, useEffect } from "react";
import {
  getPendingOrdersHandler,
  updateOrderItemHandler,
} from "src/store/orders";
import { connect, useSelector } from "react-redux";
import defaultProductImg from "../../assets/images/default-store-350x350.jpg";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CFormSelect,
  CButton,
  CSpinner,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CForm,
} from "@coreui/react";
import Pdf from "../../components/Pdf";
import { useTranslation } from "react-i18next";
import { localizedDate } from "src/services/utils";

const OrderModel = ({ data, updateOrderItemHandler }) => {
  const [loading, setLoading] = useState(true);
  const [itemAction, setItemAction] = useState("");
  const [itemId, setItemId] = useState("");
  const { t, i18n } = useTranslation(["order", "color", "global"]);
  useEffect(() => {
    setLoading(false);
  }, [data]);
  const updateItem = (e, item) => {
    e.preventDefault();
    itemAction === "canceled"
      ? updateOrderItemHandler({
          ...item,
          status: e.target.status.value,
          cancellation_reason: e.target.cancellation_reason.value,
        })
      : updateOrderItemHandler({ ...item, status: e.target.status.value });
    closeModel();
  };
  // const localizations = {
  //   ar: "ar-eg",
  //   en: "en-US",
  // };
  // const localizedDate = (date) =>
  //   Intl.DateTimeFormat(localizations[i18n.language], {
  //     day: "2-digit",
  //     year: "numeric",
  //     month: "2-digit",
  //   }).format(date);

  // const localizedNumber = (number) =>
  //   Intl.NumberFormat(localizations[i18n.language]).format(number);

  const OrderItemAction = ({ item }) => {
    const { entitle } = item;
    const [visible, setVisible] = useState(false);
    const closeModel = () => {
      setVisible(false);
    };
    return (
      <React.Fragment>
        <CButton color="secondary" onClick={() => visible(true)}>
          {t("TAKE_ACTION")}
        </CButton>
        <CModal visible={visible} alignment="center" onClose={closeModel}>
          <CModalHeader>{entitle}</CModalHeader>

          <CForm onSubmit={(e) => updateItem(e, item)}>
            <CRow>
              <CCol md={11}>
                <CFormSelect
                  id="status"
                  onChange={(e) => setItemAction(e.target.value)}
                  className="m-2-1rem"
                  value={itemAction}
                >
                  <option value="accepted">{t("APPROVE")}</option>
                  <option value="canceled">{t("reject".toUpperCase())}</option>
                </CFormSelect>
              </CCol>
              {itemAction === "canceled" && (
                <CCol md={11} className="m-2-1rem">
                  <CFormSelect
                    id="cancellation_reason"
                    required={itemAction === "rejected"}
                  >
                    <option value="incorrect item">
                      {t("INCORRECT_ITEM")}
                    </option>
                    <option value="out of stock">{t("OUT_OF_STOCK")}</option>
                    <option value="defective">
                      {t("defective".toUpperCase())}
                    </option>
                  </CFormSelect>
                </CCol>
              )}
            </CRow>
            <CModalFooter>
              <CButton color="secondary" type="button">
                {t("close")}
              </CButton>
              <CButton type="submit">
                {t("submit".toLowerCase(), { ns: "global" })}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      </React.Fragment>
    );
  };
  return (
    <>
      {loading && <CSpinner color="primary" />}
      {data?.map((order, idx) => (
        <div
          id="orders"
          key={idx}
          style={{
            border: "1px solid black",
            backgroundColor: "white",
            borderRadius: "2rem",
            padding: "2rem",
            margin: "2rem 0",
          }}
        >
          <h5>{t("ORDER_DETAILS")}</h5>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>{t("ORDER_NUMBER")}</CTableHeaderCell>
                <CTableHeaderCell>{t("CUSTOMER_NAME")}</CTableHeaderCell>
                <CTableHeaderCell>{t("GRAND_TOTAL")}</CTableHeaderCell>
                <CTableHeaderCell>{t("STATUS")}</CTableHeaderCell>
                <CTableHeaderCell>{t("PLACED_AT")}</CTableHeaderCell>
                <CTableHeaderCell>{t("UPDATED_AT")}</CTableHeaderCell>
                <CTableHeaderCell>{t("DELIVERED_AT")}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>{order.customer_order_id}</CTableDataCell>
                <CTableDataCell>
                  {`${order.first_name} ${order.last_name}`}
                </CTableDataCell>
                <CTableDataCell>
                  {localizedNumber(order.grand_total.toFixed(2))}
                </CTableDataCell>
                <CTableDataCell>{t(order.status.toUpperCase())}</CTableDataCell>
                <CTableDataCell>
                  {localizedDate(order.created_at, i18n.language)}
                </CTableDataCell>
                <CTableDataCell>
                  {order.updated
                    ? localizedDate(order.updated, i18n.language)
                    : "-"}
                </CTableDataCell>
                <CTableDataCell>
                  {order.delivery_date
                    ? localizedDate(order.delivery_date, i18n.language)
                    : "-"}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          {order.items.map((item, i) => (
            <div key={i}>
              <h6>{t("ORDER_ITEMS")}</h6>
              <CTable key={i} align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>{t("IMAGE")}</CTableHeaderCell>
                    <CTableHeaderCell>{t("TITLE")}</CTableHeaderCell>
                    <CTableHeaderCell>{t("PRICE")}</CTableHeaderCell>
                    <CTableHeaderCell>{t("QUANTITY")}</CTableHeaderCell>
                    <CTableHeaderCell>{t("SIZE")}</CTableHeaderCell>
                    <CTableHeaderCell>{t("COLOR")}</CTableHeaderCell>
                    <CTableHeaderCell>{t("STATUS")}</CTableHeaderCell>
                    {item.status === "pending" && (
                      <CTableHeaderCell>{t("ACTIONS")}</CTableHeaderCell>
                    )}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>
                      {item && (
                        <img
                          style={{ width: "7rem" }}
                          src={item.picture ?? defaultProductImg}
                          alt="img"
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      {item[`${i18n.language}title`]}
                    </CTableDataCell>
                    <CTableDataCell>
                      {localizedNumber(item.price)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {localizedNumber(item.quantity)}
                    </CTableDataCell>
                    <CTableDataCell>{item.size ?? "-"}</CTableDataCell>
                    <CTableDataCell>
                      {item.color
                        ? t(item.color?.capitalize(), { ns: "color" })
                        : "-"}
                    </CTableDataCell>
                    <CTableDataCell>
                      {t(item.status.toUpperCase())}
                    </CTableDataCell>
                    {item.status === "pending" && (
                      <CTableDataCell>
                        <OrderItemAction item={item} />
                      </CTableDataCell>
                    )}
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          ))}

          <Pdf order={order} />
        </div>
      ))}
    </>
  );
};

const mapStateToProps = (state) => ({
  pendingOrders: state.orders.pendingOrders,
});

const mapDispatchToProps = { getPendingOrdersHandler, updateOrderItemHandler };
export default connect(mapStateToProps, mapDispatchToProps)(OrderModel);
