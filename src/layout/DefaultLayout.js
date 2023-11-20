import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../components/index";
import { storeSocket } from "src/socket";
import { getNotifications } from "src/store/notifications";

const DefaultLayout = (props) => {
  const { user } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  storeSocket.emit("populate-store", user);
  storeSocket.on("triggerNotification", () => {
    alert("notification");
    dispatch(getNotifications({ limit: 5, offset: 0 }));
  });
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  login: state.login,
});

export default connect(mapStateToProps)(DefaultLayout);
