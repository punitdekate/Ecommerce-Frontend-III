import styles from "./orderList.module.css";
import OrderItem from "../orderItem/orderItem";
import emptyOrder from "../../../assets/empty-box.png";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitialOrders } from "../../../redux/reducers/orders.reducer";
import { ordersSelector } from "../../../redux/reducers/orders.reducer";
import { useNavigate } from "react-router-dom";
function OrderList() {
  const { orders, error, isLoading } = useSelector(ordersSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const laodOrders = async () => {
      dispatch(getInitialOrders());
    };
    laodOrders();
  }, [dispatch]);

  if (!orders) {
    return <div className="loadingContainer">Loading cart details...</div>; // Show a loading state or fallback
  }

  if (error) {
    return <div className="loadingContainer">error</div>;
  }
  return (
    <>
      <div className={styles.orderTitleContainer}>
        <div className={styles.backIcon} onClick={() => navigate(-1)}>
          <i className="fa-solid fa-backward"></i>
        </div>
        <div className={styles.orderImageWrapper}>Orders</div>
      </div>

      <div className={styles.orderListContainer}>
        {orders.length > 0 ? (
          orders.map((order) => <OrderItem order={order} key={order.id} />)
        ) : (
          <div>
            <img src={emptyOrder} alt="Cart" className={styles.emptyOrder} />
            <h2>Order is empty...</h2>
          </div>
        )}
      </div>
    </>
  );
}
export default OrderList;
