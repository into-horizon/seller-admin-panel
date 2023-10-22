import React from "react";
import { CRow, CCol, CSpinner, CContainer } from "@coreui/react";
function LoadingSpinner() {
  return (
    <CContainer>
      <CRow className="align-items-center justify-content-center my-3">
        <CCol xs={2}>
          <CSpinner color="primary" className="lg-spinner" />
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default LoadingSpinner;
