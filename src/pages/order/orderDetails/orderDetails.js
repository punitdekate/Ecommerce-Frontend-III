import styles from "./orderDetails.module.css";
import OrderDetailsItem from "../orderDetailsItem.js/orderDetailsItem";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ordersSelector } from "../../../redux/reducers/orders.reducer";
import { useDispatch } from "react-redux";
import { start, end } from "../../../redux/reducers/loader.reducer";

function OrderDetails() {
  const { orders } = useSelector(ordersSelector);
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(start());
    const orderData = orders.find((ele) => ele._id === orderId);
    setOrderDetails(orderData);
    dispatch(end());
  }, [orders, orderId]);

  if (!orderDetails) {
    return <div className="loadingContainer">Loading order details...</div>;
  }

  return (
    <div className={styles.orderDetails}>
      <div className={styles.orderDetailsTitle}>
        <div className={styles.backIcon} onClick={() => navigate(-1)}>
          <i className="fa-solid fa-backward"></i>
        </div>
        <div className={styles.orderImageWrapper}>Order Details</div>
      </div>
      <div className={styles.orderDetailsContainer}>
        <div className={styles.orderId}>
          <p>
            <b>Order ID: </b>
            {orderDetails._id}
          </p>
        </div>
        <div className={styles.orderDate}>
          <p>
            <b>Order Date: </b>
            {new Date(orderDetails.orderDate).toLocaleString()}
          </p>
        </div>
      </div>
      <div className={styles.items}>
        {orderDetails.products.map((product) => (
          <OrderDetailsItem product={product} key={product._id} />
        ))}
      </div>
      <div className={styles.total}>Total: Rs. {orderDetails.totalPrice}</div>
    </div>
  );
}

export default OrderDetails;
