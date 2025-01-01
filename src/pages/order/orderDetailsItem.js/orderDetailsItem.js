import styles from "./orderDetailsItem.module.css";
function OrderDetailsItem({ product }) {
  return (
    <>
      <div className={styles.orderItemContainer}>
        <div className={styles.orderItemImageContainer}>
          <img
            src={product.productId.images[0]}
            alt="product image"
            className={styles.orderItemImage}
          />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.itemDetailContainer}>
            <p>{product.productId.title}</p>
            <p>{product.productId.description}</p>
          </div>

          <div className={styles.priceContainer}>
            <div className={styles.price}>
              Rs. {product.productId.price} x {product.quantity}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailsItem;