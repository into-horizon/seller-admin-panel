import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { getTransactions } from "../../../store/finance";
import {
  CTableRow,
  CTableHead,
  CTable,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import Paginator from "../../../components/Paginator";
import LoadingSpinner from "src/components/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import {
  formatLocalizationKey,
  getSearchParamsObject,
  localizedDate,
  mainStatues,
} from "src/services/utils";
import { useTranslation } from "react-i18next";

export const Statement = ({ getTransactions }) => {
  const pageSize = 20;
  const { t, i18n } = useTranslation(["finance", "order", "status", "product"]);
  const {
    transactions: { data, count },
    loading,
  } = useSelector((state) => state.finance);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const page = searchParams.get("page");
    if (!page) {
      setSearchParams({ page: 1 });
      handelPageChange(1);
    } else {
      getTransactions(getSearchParamsObject(searchParams));
    }
  }, []);

  const handelPageChange = (n) => {
    const params = {
      ...getSearchParamsObject(searchParams),
      page: n,
      pageSize,
    };
    setSearchParams(params);
    getTransactions(params);
  };
  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <CTable striped>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>
              {t("order_number".toUpperCase(), { ns: "order" })}
            </CTableHeaderCell>
            <CTableHeaderCell>
              {t("product".toUpperCase(), { ns: "product" })}
            </CTableHeaderCell>
            <CTableHeaderCell>
              {t("amount".toUpperCase(), { ns: "finance" })}
            </CTableHeaderCell>
            <CTableHeaderCell>
              {t("status".toUpperCase(), { ns: "order" })}
            </CTableHeaderCell>
            <CTableHeaderCell>{t("type".toUpperCase())}</CTableHeaderCell>
            <CTableHeaderCell>
              {t("description".toUpperCase())}
            </CTableHeaderCell>
            <CTableHeaderCell>{t("Date".toUpperCase())}</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {React.Children.toArray(
            data.map((transaction) => (
              <CTableRow>
                <CTableDataCell>{transaction.customer_order_id?? '-'}</CTableDataCell>
                <CTableDataCell>
                  {transaction[`${i18n.language}title`]?? '-'}
                </CTableDataCell>
                <CTableDataCell>{transaction.amount}</CTableDataCell>
                <CTableDataCell>
                  {t(formatLocalizationKey(transaction.status), {
                    ns: "status",
                  })}
                </CTableDataCell>
                <CTableDataCell>{t(formatLocalizationKey(transaction.description))}</CTableDataCell>
                <CTableDataCell>
                  {t(transaction.type.toUpperCase())}
                </CTableDataCell>
                <CTableDataCell>
                  {localizedDate(
                    new Date(transaction.created_at),
                    i18n.language
                  )}
                </CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
      <Paginator
        count={count}
        onChangePage={handelPageChange}
        pageSize={20}
        page={searchParams.get("page")}
      />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getTransactions };

export default connect(mapStateToProps, mapDispatchToProps)(Statement);
