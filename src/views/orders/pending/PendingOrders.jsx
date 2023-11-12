import React, { useState, useEffect } from "react";
import { getPendingOrdersHandler } from "src/store/orders";
import { connect, useSelector } from "react-redux";
import OrdersModel from "../OrdersModel";
import Paginator from "../../../components/Paginator";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "src/components/LoadingSpinner";

const PendingOrders = ({ orders, getPendingOrdersHandler, count }) => {
  const [params, setParams] = useState({ limit: 10, offset: 0 });
  const { loading } = useSelector((state) => state.orders);
  const { t } = useTranslation("order");
  useEffect(() => {
    getPendingOrdersHandler(params);
  }, []);
  if (loading) {
    <LoadingSpinner />;
  }
  return (
    <>
      <h2>{t("PENDING_ORDERS")}</h2>
      {!loading && orders.length > 0 && (
        <>
          <OrdersModel data={orders} />
          <Paginator
            params={params}
            count={Number(count)}
            changeData={getPendingOrdersHandler}
            cookieName="pendingOrder"
          />
        </>
      )}
      {!loading && orders.length === 0 && (
        <h4 className="text-align-center">{t('NO_PENDING_ORDERS_MESSAGE')}</h4>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  orders: state.orders.pendingOrders.orders,
  count: state.orders.pendingOrders.count,
});
const mapDispatchToProps = { getPendingOrdersHandler };

export default connect(mapStateToProps, mapDispatchToProps)(PendingOrders);
