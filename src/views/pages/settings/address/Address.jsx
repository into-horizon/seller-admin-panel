import React, { useState, useEffect } from "react";
import AddressRender from "./AddressRender";
import NewAddress from "./NewAddress";
import { connect, useSelector } from "react-redux";
import { getAddress } from "../../../../store/address";
import { CSpinner } from "@coreui/react";
import LoadingSpinner from "src/components/LoadingSpinner";
const Address = ({ getAddress, storeName }) => {
  const { address, isAddressLoading } = useSelector((state) => state.address);
  useEffect(() => {
    getAddress();
  }, []);
  if (isAddressLoading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      {address.id ? (
        <AddressRender address={address}/>
      ) : (
        <NewAddress />
      )}
    </>
  );
};

const mapDispatchToProps = { getAddress };
export default connect(null, mapDispatchToProps)(Address);
