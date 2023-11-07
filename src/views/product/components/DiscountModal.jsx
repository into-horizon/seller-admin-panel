import { cilCash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const DiscountModal = ({ product, onSubmit, loading }) => {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "addProduct",
  });
  const [discountForm, setDiscountForm] = useState({
    discount: product.discount,
    discount_rate: product.discount_rate,
  });
  const [visible, setVisible] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...product, ...discountForm });
    setVisible(false);
  };
  return (
    <>
      <CButton color="secondary" type="button" onClick={() => setVisible(true)}>
        <CIcon icon={cilCash} />
        {t("discount")}
      </CButton>
      <CModal
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>{t("discount")}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CCardBody className="p-3">
            <CRow className="align-items-center justify-content-center">
              <CCol xs="6 row">
                <CCol xs="auto my-3">
                  <CFormLabel htmlFor="discount" className="my-auto">
                    {t("discount")}
                  </CFormLabel>
                </CCol>
                <CCol xs="auto my-3">
                  <CFormSwitch
                    size="lg"
                    name="discount"
                    className="my-auto"
                    onChange={(e) =>
                      setDiscountForm((x) => ({
                        ...x,
                        discount: e.target.checked,
                      }))
                    }
                    checked={!!discountForm?.discount}
                  />
                </CCol>
              </CCol>
              {discountForm.discount && (
                <CCol xs="12 row align-items-center justify-content-center">
                  <CCol xs="auto">
                    <CFormLabel htmlFor="discountRate">
                      {t("discountRate")}
                    </CFormLabel>
                  </CCol>
                  <CCol xs="auto">
                    <CFormInput
                      type="number"
                      name="discountRate"
                      max="0.99"
                      step="0.01"
                      value={discountForm.discount_rate.toFixed(2)}
                      onChange={(e) =>
                        setDiscountForm((x) => ({
                          ...x,
                          discount_rate: e.target.value,
                        }))
                      }
                    />
                  </CCol>
                </CCol>
              )}
            </CRow>
          </CCardBody>
          <CModalFooter>
            {!loading && (
              <CButton color="primary" type="submit">
                {t("submit")}
              </CButton>
            )}
            {!loading && (
              <CButton color="danger" onClick={() => setVisible(false)}>
                {t("cancel")}
              </CButton>
            )}
            {loading && <CSpinner />}
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  );
};

export default DiscountModal;
