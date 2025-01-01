import cartImage from "../../assets/shopping-cart.png";
import profileImage from "../../assets/profile-user.png";
import orderImage from "../../assets/tracking.png";
import styles from "./navbar.module.css";
import { Outlet, Link, useNavigate, NavLink } from "react-router-dom";
import Loader from "../../utility/Loader/loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userSelector } from "../../redux/reducers/user.reducer";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/user.reducer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { loaderSelector } from "../../redux/reducers/loader.reducer";
import { start, end } from "../../redux/reducers/loader.reducer";
import {
  clearError,
  errorSelector,
  setError,
} from "../../redux/reducers/error.reducer";
function Navbar() {
  /** Get the state from reducer to use for rendering the navbar on conditions */
  const { isLoggedIn, user } = useSelector(userSelector);
  const { isLoading } = useSelector(loaderSelector);
  const { message, code } = useSelector(errorSelector);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** Handle orders list for the user */
  const goToOrders = () => {
    if (isLoggedIn) {
      navigate(`${user.id}/order`);
    } else {
      navigate("/login");
    }
  };

  /** Display error message on the screen based on the code */
  useEffect(() => {
    if (code === 200 || code === 201) {
      toast.success(message);
    } else if (!code) {
      toast.info(message);
    } else {
      toast.error(message);
    }
    dispatch(clearError());
  }, [message]);

  /** Handle the cart data for the user */
  const goToCart = () => {
    isLoggedIn ? navigate(`${user.id}/cart`) : navigate("/login");
  };

  /** Handle the login and logout */
  const handleLogin = () => {
    if (isLoggedIn) {
      dispatch(start());
      dispatch(logout());
      dispatch(setError({ message: "User logout successfully!", code: 200 }));
      dispatch(end());
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <nav className={styles.navbarContainer}>
        <div className={styles.logoContainer}>
          <Link to={"/"} className={styles.logoLink}>
            Ecommerce
          </Link>
        </div>
        <div className={styles.productsLinks}>
          {isLoggedIn ? (
            <div>
              <Link to={"/products"} className={styles.links}>
                Add Product
              </Link>
            </div>
          ) : null}
        </div>
        <div className={styles.rightContainer}>
          {isLoggedIn ? (
            <div>
              <span className={styles.userName}>Hello {user.name}</span>
            </div>
          ) : null}
          <div className={styles.orderImageContainer}>
            <button onClick={goToOrders} className={styles.decorationButton}>
              <img src={orderImage} alt="Order" className={styles.orderImage} />
            </button>
          </div>
          <div className={styles.cartImageContainer}>
            <button onClick={goToCart} className={styles.decorationButton}>
              <img src={cartImage} alt="Cart" className={styles.cartImage} />
            </button>
          </div>
          <div className={styles.loginContainer}>
            <button className={styles.loginButton} onClick={handleLogin}>
              {isLoggedIn ? "Logout" : "Login"}{" "}
            </button>
          </div>
          {isLoggedIn ? (
            <div className={styles.profileContainer}>
              <NavLink>
                <img src={profileImage} alt="profile" />
              </NavLink>
            </div>
          ) : null}
          {isLoading && (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          )}
        </div>
      </nav>
      <ToastContainer className={styles.toastContainer} />
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </>
  );
}

export default Navbar;
