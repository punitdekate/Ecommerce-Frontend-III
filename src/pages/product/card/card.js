import styles from "./card.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  updateProduct,
} from "../../../redux/reducers/productList.reducer";
import { userSelector } from "../../../redux/reducers/user.reducer";
import { addToCart, getProduct } from "../../../redux/reducers/cart.reducer";
import { setError } from "../../../redux/reducers/error.reducer";
import { useState } from "react";
import Popup from "../../popup/popup";

function Card({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  /**check user is logged in or not to display the edit and delete the product */

  const { isLoggedIn } = useSelector(userSelector);
  /** Handle delete product */
  const handleDeleteProduct = async () => {
    await dispatch(deleteProduct(selectedProductId));
    setIsPopupVisible(false);
    setSelectedProductId(null);
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      dispatch(setError({ message: "Please log in to continue.", code: 400 }));
      return;
    }
    await dispatch(addToCart(productId));
  };

  const getProductDetails = async (product) => {
    navigate(`products/${product._id}/details`);
  };

  const handleUpdateProduct = (productId) => {
    navigate(`products/${product._id}/update`);
  };

  const handleShowPopup = (productId) => {
    setSelectedProductId(productId); // Set the product ID for confirmation
    setIsPopupVisible(true); // Show the popup
  };

  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.cardImageContainer}>
          <img src={product.images[0]} alt="" className={styles.cardImage} />
        </div>
        <div className={styles.cardInfoContainer}>
          <div className={styles.cardUpperContainer}>
            <div
              className={styles.cardTitle}
              onClick={() => {
                getProductDetails(product);
              }}
            >
              {product.title}
            </div>
            <div className={styles.cardDesciption}>{product.description}</div>
            <div className={styles.cardPrice}>Rs. {product.price}</div>
          </div>

          <div className={styles.cardButtonContainer}>
            {isLoggedIn ? (
              <>
                <div className={styles.editContainer}>
                  <button
                    className={styles.updateProductButton}
                    onClick={() => {
                      handleUpdateProduct(product._id);
                    }}
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                </div>
                <div className={styles.deleteContainer}>
                  <button
                    className={styles.deleteProductButton}
                    onClick={() => handleShowPopup(product._id)}
                  >
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </div>{" "}
              </>
            ) : null}
            <div className={styles.addToCartContainer}>
              <button
                className={styles.addProductButton}
                onClick={() => {
                  handleAddToCart(product._id);
                }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Popup Component */}
      {isPopupVisible && (
        <Popup
          message="Are you sure you want to delete this product?"
          onYes={handleDeleteProduct} // Execute delete on confirmation
          onNo={() => setIsPopupVisible(false)} // Close the popup on cancellation
        />
      )}
    </>
  );
}

export default Card;
