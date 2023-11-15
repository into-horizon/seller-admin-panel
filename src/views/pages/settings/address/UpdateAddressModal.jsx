import React, { useEffect, useState } from "react";
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { useTranslation } from "react-i18next";
import {
  formatLocalizationKey,
  validateMobileNumber,
} from "src/services/utils";
import { useSelector } from "react-redux";
import LoadingSpinner from "src/components/LoadingSpinner";

function UpdateAddressModal({ stateAddress, updateAddress }) {
  const [address, setAddress] = useState(stateAddress);
  const [visible, setVisible] = useState(false);
  const [invalids, setInvalids] = useState({ mobile: false });
  const { isAddressUpdating } = useSelector((state) => state.address);
  const { t } = useTranslation(["settings", "global"]);

  const onChange = (e) => {
    setAddress((address) => ({ ...address, [e.target.id]: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateMobileNumber(e.target.mobile.value)) {
      setInvalids({ mobile: true });
      return;
    }
    updateAddress(address).then(() => setVisible(false));
  };
  return (
    <>
      <CButton onClick={() => setVisible(true)}>{t("update")}</CButton>
      <CModal
        visible={visible}
        alignment="center"
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>{t(formatLocalizationKey('Update Address'))}</CModalTitle>
        </CModalHeader>
        {isAddressUpdating ? (
          <LoadingSpinner />
        ) : (
          <CForm onSubmit={handleSubmit} className="row g-3 needs-validation">
            <CModalBody className="row gy-1">
              <CFormInput
                id="first_name"
                value={address.first_name ?? ""}
                placeholder={t("firstName")}
                floatingLabel={t("firstName")}
                onChange={onChange}
              />
              <CFormInput
                id="last_name"
                value={address.last_name ?? ""}
                placeholder={t("lastName")}
                floatingLabel={t("lastName")}
                onChange={onChange}
              />
              <CFormInput
                id="region"
                value={address.region ?? ""}
                placeholder={t("region")}
                floatingLabel={t("region")}
                onChange={onChange}
              />
              <CFormInput
                id="street_name"
                value={address.street_name ?? ""}
                placeholder={t("street")}
                floatingLabel={t("street")}
                onChange={onChange}
              />
              <CFormInput
                id="building_number"
                value={address.building_number ?? ""}
                placeholder={t("building")}
                floatingLabel={t("building")}
                onChange={onChange}
              />
              <CFormInput
                id="apartment_number"
                value={address.apartment_number ?? ""}
                placeholder={t("apartment")}
                floatingLabel={t("apartment")}
                onChange={onChange}
              />
              <CFormInput
                id="mobile"
                value={address.mobile ?? ""}
                placeholder={t("mobile")}
                floatingLabel={t("mobile")}
                onChange={onChange}
                type="tel"
                feedbackInvalid={t('INVALID_MOBILE')}
                invalid={invalids.mobile}
              />
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                {t("cancel", { ns: "global" })}
              </CButton>
              <CButton color="primary" type="submit">
                {t("saveChanges", { ns: "global" })}
              </CButton>
            </CModalFooter>
          </CForm>
        )}
      </CModal>
    </>
  );
}

export default UpdateAddressModal;
