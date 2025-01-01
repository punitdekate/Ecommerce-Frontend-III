import { useEffect, useState } from "react";
import styles from "./productDetails.module.css";
import { productListSelector } from "../../../redux/reducers/productList.reducer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cart.reducer";
import { userSelector } from "../../../redux/reducers/user.reducer";
import { useNavigate } from "react-router-dom";
import { setError } from "../../../redux/reducers/error.reducer";

const ProductDetails = () => {
  const { productId } = useParams();
  const { products } = useSelector(productListSelector);
  const [product, setProduct] = useState(null); // Initially null to handle loading state
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector(userSelector);
  const navigate = useNavigate();

  useEffect(() => {
    const detail = products.find((ele) => ele._id === productId); // Find the product by ID
    if (detail) {
      setProduct(detail); // Set product details
    }
  }, [productId, products]);

  const handleThumbnailIndex = (index) => {
    setIndex(index);
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      dispatch(setError({ message: "Please log in to continue.", code: 400 }));
      return;
    }
    await dispatch(addToCart(productId));
  };

  /** Handle the cart data for the user */
  const goToCart = () => {
    if (isLoggedIn) {
      navigate(`/${user.id}/cart`);
    } else {
      dispatch(setError({ message: "Please log in to continue.", code: 400 }));
    }
  };

  if (!product) {
    return <div className="loadingContainer">Loading product details...</div>; // Show a loading state or fallback
  }

  return (
    <div className={styles.container}>
      {/* Image Gallery */}
      <div className={styles.imageGallery}>
        <img
          src={product.images[index] || "placeholder.jpg"}
          alt={product.title}
          className={styles.mainImage}
        />
        <div className={styles.thumbnails}>
          {product.images.map((image, i) => (
            <img
              key={i}
              src={image}
              alt={`Thumbnail ${i + 1}`}
              className={styles.thumbnail}
              onClick={() => handleThumbnailIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className={styles.details}>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.price}>${product.price?.toFixed(2)}</p>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.description}>{product.category}</p>

        <div className={styles.buttons}>
          <button
            className={`${styles.btn} ${styles.addToCart}`}
            onClick={() => {
              handleAddToCart(product._id);
            }}
          >
            Add To Cart
          </button>
          <button
            className={`${styles.btn} ${styles.shopNow}`}
            onClick={() => goToCart()}
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
