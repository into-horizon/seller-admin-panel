import React, { useState, useEffect, Children } from "react";
import { connect, useSelector } from "react-redux";
import {
  CWidgetStatsF,
  CRow,
  CCol,
  CSpinner,
  CAccordionHeader,
  CAccordionItem,
  CAccordion,
  CAccordionBody,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilChartPie,
  cilLockLocked,
  cilHistory,
  cilCheck,
  cilWallet,
  cilPlus,
  cilCloudDownload,
  cilPaperclip,
} from "@coreui/icons";
import { getPendingAmounts } from "../../../store/finance";
import { getCashAccount, getAccountsHandler } from "src/store/bankAccount";
import {
  getWithdrawalsHandler,
  addWithdrawalHandler,
} from "src/store/withdrawal";
import Paginator from "../../../components/Paginator";
import AccountModal from "../../pages/settings/transfer-account/AccountModal";
import LoadingSpinner from "src/components/LoadingSpinner";
import { Trans, useTranslation } from "react-i18next";
import { formatLocalizationKey, localizedDate } from "src/services/utils";

export const Summary = ({
  getPendingAmounts,
  getCashAccount,
  getAccountsHandler,
  getWithdrawalsHandler,
  addWithdrawalHandler,
}) => {
  const pageSize = 5;
  const { t, i18n } = useTranslation(["finance", "status", "global"]);
  const { pending, released, refunded, loading } = useSelector(
    (state) => state.finance
  );
  const { account, cashAccount } = useSelector((state) => state.bankAccount);
  const {
    withdrawals: { data: withdrawals, count, canWithdraw },
    loading: withdrawalsLoading,
  } = useSelector((state) => state.withdrawals);
  const [params, setParams] = useState({ pageSize, page: 1 });
  const [add, setAdd] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  useEffect(() => {
    Promise.all([
      getPendingAmounts(),
      getCashAccount(),
      getAccountsHandler(),
      getWithdrawalsHandler(params),
    ]);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setProgressLoading(true);
    let obj = {
      account_id: e.target.account.value,
      amount: e.target.amount.value,
    };
    Promise.all([addWithdrawalHandler(obj)]).then(() => {
      e.target.reset();
      getWithdrawalsHandler(params);
      setProgressLoading(false);
    });
  };
  const handlePageChange = (page) => {
    setParams(() => {
      const newParams = { pageSize, page };
      getWithdrawalsHandler({ pageSize, page });
      return newParams;
    });
  };
  useEffect(() => {
    handlePageChange(1);
  }, []);
  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <AccountModal account={{}} add={add} onClose={() => setAdd(false)} />
      <CRow>
        <CCol lg={4} md={4} xs={12} sm={4}>
          <CWidgetStatsF
            className="mb-3"
            color="warning"
            icon={<CIcon icon={cilLockLocked} height={24} />}
            padding={false}
            title={t("pending".toUpperCase(), { ns: "status" })}
            value={pending}
          />
        </CCol>
        <CCol lg={4} md={4} xs={12} sm={4}>
          <CWidgetStatsF
            className="mb-3"
            color="success"
            icon={<CIcon icon={cilCheck} height={24} />}
            padding={false}
            title={t("released".toUpperCase(), { ns: "status" })}
            value={released}
          />
        </CCol>
        <CCol lg={4} md={4} xs={12} sm={4}>
          <CWidgetStatsF
            className="mb-3"
            color="danger"
            icon={<CIcon icon={cilHistory} height={24} />}
            padding={false}
            title={t("refunded".toUpperCase(), { ns: "status" })}
            value={refunded}
          />
        </CCol>
      </CRow>
      <CRow className="justify-content-md-center">
        <CCol xs={12}>
          {progressLoading ? (
            <CSpinner color="primary" />
          ) : (
            canWithdraw &&
            released > 0 && (
              <CAccordion activeItemKey={0}>
                <CAccordionItem itemKey={1}>
                  <CAccordionHeader>
                    <CRow>
                      <CCol xs="auto">
                        <CIcon icon={cilWallet} size="lg" />
                      </CCol>
                      <CCol>
                        <strong>
                          <Trans
                            defaults={t("WITHDRAWABLE_TEXT")}
                            values={{ amount: released }}
                          />
                        </strong>
                      </CCol>
                    </CRow>
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CForm onSubmit={submitHandler}>
                      <CRow className="justify-content-md-center align-items-end ">
                        <CCol xs={3}>
                          <CFormLabel>
                            {t(formatLocalizationKey("requested amount"))}
                          </CFormLabel>
                          <CFormInput
                            type="number"
                            step="any"
                            max={released}
                            defaultValue={released}
                            id="amount"
                          />
                        </CCol>
                        <CCol xs={3}>
                          <CFormLabel>
                            {t(formatLocalizationKey("Transfer To"))}
                          </CFormLabel>
                          <CFormSelect id="account">
                            <option value={cashAccount.id}>
                              {cashAccount.title}
                            </option>
                            {account.id && (
                              <option value={account.id}>
                                {account.title}
                              </option>
                            )}
                          </CFormSelect>
                        </CCol>
                        {!account.id && (
                          <CCol xs="auto">
                            <CButton
                              color="secondary"
                              title="add account"
                              onClick={() => setAdd(true)}
                              type="button"
                            >
                              <CIcon icon={cilPlus} size="lg" />
                            </CButton>
                          </CCol>
                        )}
                        <CCol xs="auto">
                          <CButton type="submit">
                            {t(formatLocalizationKey("submit"), { ns: "global" })}
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CAccordionBody>
                </CAccordionItem>
              </CAccordion>
            )
          )}
        </CCol>
      </CRow>
      {withdrawalsLoading ? (
        <LoadingSpinner />
      ) : (
        <CRow className="justify-content-md-center mgn-top50">
          <CCol xs={8}>
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>
                    {t(formatLocalizationKey("transfer to"))}
                  </CTableHeaderCell>
                  <CTableHeaderCell>
                    {t(formatLocalizationKey("amount"))}
                  </CTableHeaderCell>
                  <CTableHeaderCell>
                    {t(formatLocalizationKey("status"))}
                  </CTableHeaderCell>
                  <CTableHeaderCell>
                    {t(formatLocalizationKey("created at"))}
                  </CTableHeaderCell>
                  <CTableHeaderCell>
                    {t(formatLocalizationKey("updated at"))}
                  </CTableHeaderCell>
                  <CTableHeaderCell>
                    {t(formatLocalizationKey("attachment"))}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {Children.toArray(
                  withdrawals.map((withdrawal) => (
                    <CTableRow>
                      <CTableDataCell>{withdrawal.title}</CTableDataCell>
                      <CTableDataCell>{withdrawal.amount}</CTableDataCell>
                      <CTableDataCell>
                        {t(formatLocalizationKey(withdrawal.status), {
                          ns: "status",
                        })}
                      </CTableDataCell>
                      <CTableDataCell>
                        {localizedDate(
                          withdrawal.created_at,
                          i18n.language
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {withdrawal.updated
                          ? localizedDate(
                              new Date(withdrawal.updated),
                              i18n.language
                            )
                          : "-"}
                      </CTableDataCell>
                      <CTableDataCell>
                        {withdrawal.document ? (
                          <a href={withdrawal.document} target="_blank">
                            <CIcon icon={cilPaperclip} />
                          </a>
                        ) : (
                          "-"
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
            <Paginator
              page={params?.page}
              count={count}
              pageSize={5}
              onChangePage={handlePageChange}
            />
          </CCol>
        </CRow>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  pending: state.finance.pending,
});

const mapDispatchToProps = {
  getPendingAmounts,
  getCashAccount,
  getAccountsHandler,
  getWithdrawalsHandler,
  addWithdrawalHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
