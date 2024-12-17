import React, { useState, useEffect } from "react";
import {
  getOverviewOrdersHandler,
  getStatuesHandler,
} from "../../../store/orders";
import OrdersModel from "../OrdersModel";
import { connect, useDispatch } from "react-redux";
import Paginator from "../../../components/Paginator";
import {
  CForm,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CFormCheck,
  CFormInput,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";
import LoadingSpinner from "src/components/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import { getSearchParamsObject } from "src/services/utils";
import { useTranslation } from "react-i18next";
const OrdersOverview = ({
  // getOverviewOrdersHandler,
  orders,
  count,
  getStatuesHandler,
  statuses,
  loading,
}) => {
  const pageSize = 5;
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("status");
  const dispatch = useDispatch();
  const { t } = useTranslation(["order"]);
  const updateSearchParams = (key, value) => {
    let data = {};
    for (const name of searchParams.keys()) {
      if (!_.isEmpty(searchParams.get(name))) {
        data[name] = searchParams.get(name);
      }
    }
    data[key] = value;
    setSearchParams(data);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    handlePageChange(1);
  };
  const handlePageChange = (n) => {
    // updateSearchParams("page", n);
    setSearchParams({ ...getSearchParamsObject(searchParams), page: n });
    dispatch(
      getOverviewOrdersHandler({
        ...getSearchParamsObject(searchParams),
        page: n,
        pageSize,
      })
    );
  };
  useEffect(() => {
    const page = searchParams.get("page");
    if (_.isEmpty(page)) {
      setSearchParams({ page: 1 });
      handlePageChange(1);
    } else {
      handlePageChange(page);
    }
    getStatuesHandler();
  }, []);

  return (
    <>
      <h2>{t("ORDERS_OVERVIEW")}</h2>
      <CRow className="bg-white p-5 border rounded">
        <CCol md={2}>
          <strong>{t("SEARCH_BY")}</strong>
        </CCol>
        <CCol md={2}>
          <CFormCheck
            type="radio"
            name="search"
            value="status"
            label={t("ORDER_STATUS")}
            defaultChecked
            onChange={(e) => setSearchType(e.target.value)}
            checked={searchType === "status"}
          />
        </CCol>
        <CCol md={2}>
          <CFormCheck
            type="radio"
            name="search"
            value="number"
            label={t("ORDER_NUMBER")}
            onChange={(e) => setSearchType(e.target.value)}
            checked={!!searchParams.get("order_id") || searchType === "number"}
          />
        </CCol>

        {searchType === "status" && (
          <CForm onSubmit={submitHandler} className="mgn-top50">
            <CRow>
              <CCol>
                <CFormSelect
                  id="status"
                  onChange={(e) =>
                    setSearchParams({ status: e.target.value, page: 1 })
                  }
                  value={searchParams.get("status") ?? ""}
                >
                  <option value="">{t("ALL")}</option>
                  {React.Children.toArray(
                    statuses.map((status) => (
                      <option value={status}>{t(status.toUpperCase())}</option>
                    ))
                  )}
                </CFormSelect>
              </CCol>
              <CCol>
                <CButton type="submit">
                  <CIcon icon={cilSearch} />
                  {t("SEARCH")}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        )}
        {searchType === "number" && (
          <CForm className="mgn-top50" onSubmit={submitHandler}>
            <CRow>
              <CCol>
                <CFormInput
                  type="text"
                  placeholder={t('ORDER_NUMBER')}
                  id="order"
                  value={searchParams.get("order_id") ?? ""}
                  onChange={(e) => {
                    if (_.isEmpty(e.target.value)) {
                      setSearchParams((original) =>
                        original.delete("order_id")
                      );
                    } else {
                      setSearchParams({ order_id: e.target.value, page: 1 });
                    }
                  }}
                />
              </CCol>
              <CCol>
                <CButton type="submit">
                  <CIcon icon={cilSearch} />
                  {t("SEARCH")}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        )}
      </CRow>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <OrdersModel data={orders} />
          <Paginator
            count={Number(count)}
            pageSize={pageSize}
            onChangePage={handlePageChange}
            page={searchParams.get("page")}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  orders: state.orders.ordersOverview.data,
  count: state.orders.ordersOverview?.count,
  statuses: state.orders.statuses,
  loading: state.orders.loading,
});

const mapDispatchToProps = { getOverviewOrdersHandler, getStatuesHandler };

export default connect(mapStateToProps, mapDispatchToProps)(OrdersOverview);
