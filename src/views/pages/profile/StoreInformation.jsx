import React, { useEffect, useState } from "react";
import { useSelector, connect, useDispatch } from "react-redux";
import {
  CFormFloating,
  CFormInput,
  CFormLabel,
  CButton,
  CForm,
} from "@coreui/react";
import { useTranslation } from "react-i18next";
import { updateInfo, updateName } from "../../../store/auth";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "src/components/LoadingSpinner";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.login);
  const { t } = useTranslation("profile");
  const [updatedUser, setUpdatedUser] = useState(user);
  const changeHandler = (e) => {
    setUpdatedUser((originalState) => ({
      ...originalState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.store_name !== updatedUser.store_name) {
      dispatch(updateName(e.target.store_name.value));
    }
    dispatch(updateInfo(updatedUser));
  };
  useEffect(() => {
    if (!!user) {
      setUpdatedUser(user);
    }
  }, [user]);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <h3>{t(('MY_INFORMATION'))}</h3>
      <CForm onSubmit={handleSubmit}>
        <CFormFloating className="mb-3">
          <CFormInput
            type="text"
            id="floatingInput"
            name="store_name"
            value={updatedUser.store_name ?? ""}
            onChange={changeHandler}
            disabled={updatedUser.name_is_changed}
          />
          <CFormLabel htmlFor="floatingInput">{t("store_name")}</CFormLabel>
        </CFormFloating>
        <CFormFloating className="mb-3">
          <CFormInput
            type="text"
            id="floatingInput"
            name="caption"
            value={updatedUser.caption ?? ""}
            onChange={changeHandler}
          />
          <CFormLabel htmlFor="floatingInput">{t("caption")}</CFormLabel>
        </CFormFloating>
        <CFormFloating className="mb-3">
          <CFormInput
            type="text"
            id="floatingInput"
            name="about"
            value={updatedUser.about ?? ""}
            onChange={changeHandler}
          />
          <CFormLabel htmlFor="floatingInput">{t("about")}</CFormLabel>
        </CFormFloating>
        <CFormFloating className="mb-3">
          <CFormInput
            type="tel"
            id="floatingInput"
            name="mobile"
            value={updatedUser.mobile ?? ""}
            onChange={changeHandler}
          />
          <CFormLabel htmlFor="floatingInput">{t("mobile")}</CFormLabel>
        </CFormFloating>

        <CButton color="primary" type="submit">{t("update")}</CButton>
        <CButton color="light" onClick={() => navigate("/dashboard")}>
          {t("cancel")}
        </CButton>
      </CForm>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { updateInfo, updateName };

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);
