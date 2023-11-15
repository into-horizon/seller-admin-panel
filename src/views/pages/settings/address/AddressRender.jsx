import React, { useState, useEffect } from "react";
import { updateAddress, removeAddress } from "../../../../store/address";
import { connect, useSelector } from "react-redux";
import {
  CCard,
  CButton,
  CCardHeader,
  CCardTitle,
  CCardText,
  CCardBody,
} from "@coreui/react";
import { useTranslation } from "react-i18next";
import {
  AnimationType,
  DialogType,
  OutAnimationType,
  PopupProvider,
  usePopup,
  ToastPosition,
} from "react-custom-popup";
import UpdateAddressModal from "./UpdateAddressModal";
import LoadingSpinner from "src/components/LoadingSpinner";
import DeleteModal from "src/components/DeleteModal copy";

const buttonStyles = {
  display: "block",
  marginTop: 5,
};

const ViewAddress = ({ updateAddress, removeAddress, address }) => {
  const { store_name: storeName } = useSelector((state) => state.login.user);
  const { t } = useTranslation("settings");
  const removeHandler = (id) => {
    removeAddress(id);
  };
  return (
    <>
      <CCard className="my-3">
        <CCardHeader>{storeName}</CCardHeader>
        <CCardBody>
          <CCardTitle>{`${address.first_name} ${address.last_name}`}</CCardTitle>
          <CCardText>
            {`${address.city} - ${address.region} - ${address.street_name}`}
            {address.building_number && `- building:${address.building_number}`}
            {address.apartment_number &&
              `- apartment:${address.apartment_number}`}
          </CCardText>
          <UpdateAddressModal
            stateAddress={address}
            updateAddress={updateAddress}
          />
          <DeleteModal
            color="danger"
            className="mx-2"
            btnText={t("delete")}
            icon={false}
            onConfirm={() => removeHandler(address.id)}
          />
        </CCardBody>
      </CCard>
    </>
  );
};

const mapDispatchToProps = { updateAddress, removeAddress };
export default connect(null, mapDispatchToProps)(ViewAddress);
