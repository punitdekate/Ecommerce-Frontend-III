import styles from "./cartItem.module.css";
import { useDispatch } from "react-redux";
import { opCart, removeFromCart } from "../../../redux/reducers/cart.reducer";

function CartItem({ cartItem }) {
  const dispatch = useDispatch();

  const handleRemove = async (productId) => {
    await dispatch(removeFromCart(productId)).unwrap();
  };

  const handleOpCart = async (productId, op) => {
    await dispatch(opCart({ productId, op })).unwrap();
  };

  return (
    <>
      <div className={styles.cartItemContainer}>
        <div className={styles.cartItemImageContainer}>
          <img
            src={cartItem?.images?.length > 0 ? cartItem.images[0] : null}
            alt="product image"
            className={styles.itemImage}
          />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.itemDetailContainer}>
            <p className={styles.itemTitle}>{cartItem.title}</p>
            <p className={styles.itemDescription}>{cartItem.description}</p>
            <p className={styles.itemPrice}>Rs. {cartItem.price}</p>
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.cardButtonContainer}>
              <div className={styles.cardMinusContainer}>
                <button
                  className={styles.removeButton}
                  onClick={() => handleOpCart(cartItem._id, "dec")}
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>

              <div className={styles.cardCountContainer}>
                <p className={styles.count}>
                  <b>{cartItem.quantity}</b>
                </p>
              </div>

              <div className={styles.cardAddContainer}>
                <button
                  className={styles.addButton}
                  onClick={() => handleOpCart(cartItem._id, "inc")}
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
              <div className={styles.addToCartContainer}>
                <button
                  className={styles.removeFromCartButton}
                  onClick={() => handleRemove(cartItem._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartItem;
