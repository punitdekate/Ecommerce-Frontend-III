import { useRef, useState } from "react";
import styles from "./product.module.css";
import { setError } from "../../../redux/reducers/error.reducer";
import { useDispatch } from "react-redux";
import { addProduct } from "../../../redux/reducers/productList.reducer";
import { useNavigate } from "react-router-dom";
import FormData from "form-data";

function Product() {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    images: [], // To store the uploaded images
    category: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Get selected files
    console.log(files);

    if (product.images?.length + files.length > 3) {
      setError({ message: "You can upload up to 3 images only." });
      return;
    }

    const newImages = files.map((file) => ({
      file, // Store the File object
      preview: URL.createObjectURL(file), // Create and store the preview URL
    }));

    setProduct({
      ...product,
      images: [...product.images, ...newImages], // Append new images
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input field
    }
  };

  const removeImage = (index) => {
    const updatedImages = product.images.filter((_, i) => i !== index);

    // Revoke object URLs to avoid memory leaks
    URL.revokeObjectURL(product.images[index]?.preview);

    setProduct({ ...product, images: updatedImages });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    let data = new FormData();

    // Append product data
    data.append("title", product.title);
    data.append("description", product.description);
    data.append("price", product.price);
    data.append("stock", product.stock);
    data.append("category", product.category);

    // Append files (images) as actual files
    product.images.forEach((image) => {
      data.append("images", image.file); // Append the file directly, not the URL
    });

    dispatch(addProduct(data));
    navigate("/");
  };

  return (
    <form onSubmit={(e) => handleAddProduct(e)} encType="multipath/form-data">
      <div className={styles.productContainer}>
        <div className={styles.productHeader}>
          <div onClick={() => navigate(-1)}>
            <i class="fa-solid fa-backward"></i>
          </div>
          <div>
            <i className="fa-solid fa-square"></i> Add New Product
          </div>
          <div>
            <button>Add Product</button>
          </div>
        </div>
        <div className={styles.productInfo}>
          <div className={styles.generalInfoContainer}>
            <div className={styles.generalInfoTitle}>General Information</div>
            <div className={styles.generalInfoContainer}>
              <div className={styles.productNameContainer}>
                <Label name="Name Product" />
                <input
                  type="text"
                  placeholder="Product name"
                  className={styles.productNameInput}
                  value={product.title}
                  onChange={(e) =>
                    setProduct({ ...product, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.productDescContainer}>
                <Label name="Description Product" />
                <textarea
                  className={styles.productDescInput}
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                  required
                ></textarea>
              </div>
            </div>
            <div className={styles.priceAndStockContainer}>
              <div className={styles.priceAndStockTitle}>Pricing And Stock</div>
              <div>
                <Label name="Price" />
                <input
                  className={styles.priceInput}
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label name="Stock" />
                <input
                  className={styles.stockInput}
                  value={product.stock}
                  onChange={(e) =>
                    setProduct({ ...product, stock: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <div className={styles.productImageAndCategory}>
              <Label name="Upload Images (Max 3 Images)" />
              <input
                className={styles.uploadImgInput}
                type="file"
                multiple
                onChange={handleImageUpload}
              />
              <div className={styles.productImagePreviewList}>
                {product.images.map((image, index) => (
                  <div key={index} className={styles.listImage}>
                    <img
                      src={image.preview}
                      alt={`Preview ${index}`}
                      className={styles.previewImage}
                    />
                    <button
                      type="button"
                      className={styles.removeImageButton}
                      onClick={() => removeImage(index)}
                    >
                      <i class="fa-solid fa-x"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.categoryContainer}>
              <div className={styles.categoryTitle}>Category</div>
              <div className={styles.categoryInput}>
                <Label name="Product Category" />
                <select
                  value={product.category}
                  onChange={(e) =>
                    setProduct({ ...product, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function Label(props) {
  return <label className={styles.productLabel}>{props.name}</label>;
}

export default Product;
