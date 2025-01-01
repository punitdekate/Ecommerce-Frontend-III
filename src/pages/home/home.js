import Card from "../product/card/card";
import styles from "./home.module.css";
import {
  getFilterState,
  getInitialState,
  productListSelector,
} from "../../redux/reducers/productList.reducer";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Home() {
  const dispatch = useDispatch();

  /** Initial products */
  const { products } = useSelector(productListSelector);
  const [filter, setFilter] = useState({
    highToLow: false,
    lowToHigh: false,
    category: null,
  });

  /** Load the product list at initial rendering of the app */
  const loadData = async () => {
    await dispatch(getInitialState()).unwrap();
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = (type) => {
    const updatedFilter = { ...filter };
    if (type === "highToLow") {
      updatedFilter.highToLow = true;
      updatedFilter.lowToHigh = false;
    } else if (type === "lowToHigh") {
      updatedFilter.highToLow = false;
      updatedFilter.lowToHigh = true;
    }

    // Update filter state after modifying
    setFilter(updatedFilter);

    // Dispatch the updated filter state to the redux store
    dispatch(getFilterState(updatedFilter));
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const updatedFilter = { ...filter, category: newCategory };

    // Update category in the local state
    setFilter(updatedFilter);

    // Dispatch the updated filter state
    dispatch(getFilterState(updatedFilter));
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.filterContainer}>
        <button
          className={`${styles.filterButton} ${
            filter.highToLow ? styles.activeButton : ""
          }`}
          onClick={() => handleFilter("highToLow")}
        >
          Low To High <i className="fa-solid fa-sort"></i>
        </button>
        <button
          className={`${styles.filterButton} ${
            filter.lowToHigh ? styles.activeButton : ""
          }`}
          onClick={() => handleFilter("lowToHigh")}
        >
          High To Low <i className="fa-solid fa-sort"></i>
        </button>
        <select
          className={`${styles.filterSelect} ${
            filter.category ? styles.activeButton : ""
          }`}
          value={filter.category}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
        </select>
      </div>
      <div>
        {products.map((product, index) => (
          <Card product={product} key={index} />
        ))}
      </div>
    </div>
  );
}

export default Home;
