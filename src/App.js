import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import "./scss/style.scss";
import { PopupProvider } from "react-custom-popup";
import { getUser } from "./store/auth";
import { useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import cookie from "react-cookies";
import { useTranslation } from "react-i18next";
import { Rings } from "react-loader-spinner";
import {
  getParentCategoriesHandler,
  getChildCategoriesHandler,
  getGrandChildCategoriesHandler,
  getCategories,
} from "./store/category";
import { getAddress } from "./store/address";
import GlobalToast from "./components/Toast";
import GlobalDialog from "./components/Dialog";
import { CCol, CContainer, CRow } from "@coreui/react";
import * as buffer from "buffer";
import Auth from "./services/Auth";
import { history } from "./services/utils";
window.Buffer = buffer.Buffer;

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));
const Verify = React.lazy(() => import("./views/pages/verify/verify"));
const Reference = React.lazy(() => import("./views/pages/password/reference"));
const ResetPassword = React.lazy(() =>
  import("./views/pages/password/ResetPassword")
);

const App = ({
  getParentCategoriesHandler,
  getChildCategoriesHandler,
  getGrandChildCategoriesHandler,
  getAddress,
  getCategories,
  getUser,
}) => {
  const {
    loggedIn,
    user: { id, verified_email },
  } = useSelector((state) => state.login);

  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [load, setLoad] = useState(true);
  const location = useLocation();
  let token = cookie.load("access_token");
  const checkUnAuth = (route) => {
    let unAuth = ["/login", "/register", "/reference"];
    if (
      unAuth.some((x) => x === route) ||
      route?.startsWith("/resetPassword")
    ) {
      return true;
    } else return false;
  };
  useEffect(() => {
    let tabID = sessionStorage.tabID
      ? sessionStorage.tabID
      : (sessionStorage.tabID = (Math.random() * 1000).toFixed(0));
    const lang = localStorage.getItem("i18nextLng");
    if (lang) {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage("en");
    }
  }, []);

  useEffect(() => {
    let currentPath = location.pathname;
    Promise.all([new Auth().checkAPI()])
      .then(() => {
        if (location.pathname === "/500") {
          navigate("/");
        }
        if (!id && token) {
          getUser();
        }
        if (loggedIn && id && verified_email) {
          getAddress();
          getCategories();
          navigate(!checkUnAuth(location.pathname) ? location.pathname : "/");
        } else if (!loggedIn && !token && !id) {
          let path = checkUnAuth(currentPath) ? currentPath : "/login";
          navigate(path);
        } else if (verified_email === false) {
          navigate("/verify");
        }
        setLoad(false);
      })
      .catch(() => {
        setLoad(false);
        navigate("/500");
      });
  }, [loggedIn, verified_email]);

  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.setAttribute("lang", "ar");
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("lang", "en");
      document.documentElement.setAttribute("dir", "ltl");
      i18n.changeLanguage("en");
    }
  }, [i18n.language]);

  const Loading = () => (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs="auto">
            <Rings height="35rem" width="150" color="blue" />
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
  return (
    <PopupProvider>
      <GlobalToast />
      <GlobalDialog />
      <React.Suspense fallback={<Loading />}>
        {load && <Loading />}
        {!load && (
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route
              exact
              path="/register"
              name="Register Page"
              element={<Register />}
            />
            <Route exact path="/verify" name="verify" element={<Verify />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="/reference" name="reference" element={<Reference />} />
            <Route
              path="/resetPassword/:token"
              name="password reset"
              element={<ResetPassword load={(x) => setLoad(x)} />}
            />
            <Route path="/*" name="Home" element={<DefaultLayout />} />
            <Route path="*" name="Page 404" element={<Page404 />} />
          </Routes>
        )}
      </React.Suspense>
    </PopupProvider>
  );
};

const mapStateToProps = (state) => ({
  login: state.login,
});
const mapDispatchToProps = {
  getUser,
  getParentCategoriesHandler,
  getChildCategoriesHandler,
  getGrandChildCategoriesHandler,
  getAddress,
  getCategories,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
