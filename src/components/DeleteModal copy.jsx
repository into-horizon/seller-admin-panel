import { Button } from "@coreui/coreui";
import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTooltip,
} from "@coreui/react";
import React from "react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

const DeleteModal = ({ onConfirm, tooltipContent, btnSize, disabled, btnText }) => {
  const { t } = useTranslation("translation", { keyPrefix: "globals" });
  const [visible, setVisible] = useState(false);
  return (
    <>
      <CTooltip content={tooltipContent ?? "delete"}>
        <CButton
          size={btnSize}
          color="danger"
          onClick={() => setVisible(true)}
          disabled={disabled}
        >
          <CIcon icon={cilTrash} size={btnSize} />
          {btnText}
        </CButton>
      </CTooltip>
      <CModal
        visible={visible}
        alignment="center"
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle> {t("deleteTitle")}</CModalTitle>
        </CModalHeader>
        <CModalBody> {t("deleteText")}</CModalBody>
        <CModalFooter>
          <CButton
            color="danger"
            onClick={() => onConfirm(() => setVisible(false))}
          >
            {t("delete")}
          </CButton>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            {t("cancel")}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default DeleteModal;
