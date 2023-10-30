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
import { getSearchParamsObject } from "src/services/utils";
export const Statement = ({ getTransactions }) => {
  const pageSize = 20;
  const {
    transactions: { data, count },
    loading,
  } = useSelector((state) => state.finance);
  // const [params, setParams] = useState({ limit: 20, offset: 0 });
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
    const params = { ...getSearchParamsObject(searchParams), page: n,pageSize };
    setSearchParams(params);
    getTransactions(params);
    // setParams((params) => {
    //   const newParams = { ...params, offset: (n - 1) * params.limit };
    //   return newParams;
    // });
  };
  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <CTable striped>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>id</CTableHeaderCell>
            <CTableHeaderCell>order number</CTableHeaderCell>
            <CTableHeaderCell>product</CTableHeaderCell>
            <CTableHeaderCell>amount</CTableHeaderCell>
            <CTableHeaderCell>status</CTableHeaderCell>
            <CTableHeaderCell>type</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {React.Children.toArray(
            data.map((transaction) => (
              <CTableRow>
                <CTableDataCell>{transaction.id.substring(24)}</CTableDataCell>
                <CTableDataCell>{transaction.customer_order_id}</CTableDataCell>
                <CTableDataCell>{transaction.entitle}</CTableDataCell>
                <CTableDataCell>{transaction.amount}</CTableDataCell>
                <CTableDataCell>{transaction.status}</CTableDataCell>
                <CTableDataCell>{transaction.type}</CTableDataCell>
                <CTableDataCell>
                  {new Date(transaction.created_at).toLocaleDateString()}
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
