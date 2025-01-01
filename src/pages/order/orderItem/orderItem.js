import styles from "./orderItem.module.css";
import { Link } from "react-router-dom";

function OrderItem({ order }) {
  const orderImage =
    order.products[0]?.productId?.images[0] || "/defaultImage.jpg";

  return (
    <Link to={`${order._id}`} className={styles.orderItemContainerLink}>
      <div className={styles.orderItemContainer}>
        <div className={styles.orderItemImageContainer}>
          <img
            src={orderImage}
            alt="Order Preview"
            className={styles.orderItemImage}
          />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.itemDetailContainer}>
            <p>
              <b>Order Id:</b> {order._id}
            </p>
            <p>
              <b>Date Of Order:</b> {order.orderDate.substring(0, 28)}
            </p>
          </div>
          <div className={styles.priceContainer}>
            <div className={styles.price}>
              <b>Total:</b> Rs. {order.totalPrice}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default OrderItem;
