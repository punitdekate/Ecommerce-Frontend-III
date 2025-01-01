import CartItem from "../cartItem/cartItem";
import cartImage from "../../../assets/shopping-cart.png";
import emptyCart from "../../../assets/empty-cart.png";
import styles from "./cart.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getInitialCart } from "../../../redux/reducers/cart.reducer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { cartSelector } from "../../../redux/reducers/cart.reducer";
import { userSelector } from "../../../redux/reducers/user.reducer";
import { start, end } from "../../../redux/reducers/loader.reducer";
import { toast } from "react-toastify";
import { placeOrderSelector } from "../../../redux/reducers/placeOrder.reducer";
import { placeOrderThunk } from "../../../redux/reducers/placeOrder.reducer";
import { reset } from "../../../redux/reducers/cart.reducer";

function Cart() {
  const { cart } = useSelector(cartSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      await dispatch(getInitialCart()).unwrap();
    };
    loadCart();
  }, []);
  const handlePlacedOrder = async () => {
    dispatch(placeOrderThunk());
  };

  if (!cart) {
    return <div className="loadingContainer">Loading cart details...</div>; // Show a loading state or fallback
  }

  console.log(cart);

  return (
    <>
      <div className={styles.cartTitleContainer}>
        <div className={styles.backIcon} onClick={() => navigate(-1)}>
          <i className="fa-solid fa-backward"></i>
        </div>
        <div className={styles.cartImageWrapper}>
          <img src={cartImage} alt="Cart" className={styles.cartImage} /> Cart
        </div>
      </div>

      <div className={styles.cartMainContainer}>
        <div className={styles.cartContainer}>
          {cart.length > 0 ? (
            cart.map((ele, index) => <CartItem cartItem={ele} key={index} />)
          ) : (
            <div>
              <img src={emptyCart} alt="Cart" className={styles.emptyCart} />
              <h2>Cart is empty...</h2>
            </div>
          )}
        </div>
        {cart.length > 0 ? (
          <div className={styles.totalContainer}>
            <div>
              <h3>
                {"Total = Rs. " +
                  cart
                    .reduce((acc, curVal) => {
                      return acc + parseFloat(curVal.price * curVal.quantity);
                    }, 0)
                    .toFixed(2)}
              </h3>
            </div>
            <div>
              <button
                className={styles.placeOrderButton}
                onClick={() => handlePlacedOrder()}
              >
                Place Order
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Cart;
