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

  /** Load the product list at intital rendering of the app */
  const loadData = async () => {
    await dispatch(getInitialState()).unwrap();
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = (type) => {
    if (type === "highToLow") {
      setFilter({
        highToLow: true,
        lowToHigh: false,
        category: filter.category,
      });
    } else if (type === "lowToHigh") {
      setFilter({
        highToLow: false,
        lowToHigh: true,
        category: filter.category,
      });
    }
    dispatch(getFilterState(filter)); // Dispatch the filter state to update the product list
  };

  const handleCategoryChange = (e) => {
    setFilter({
      ...filter,
      category: e.target.value,
    });
    dispatch(getFilterState({ ...filter, category: e.target.value }));
  };

  return (
    <>
      <div className={styles.homeContainer}>
        <div className={styles.filterContainer}>
          <button
            className={`${styles.filterButton} ${
              filter.highToLow ? styles.activeButton : ""
            }`}
            onClick={() => handleFilter("highToLow")}
          >
            High To Low <i class="fa-solid fa-sort"></i>
          </button>
          <button
            className={`${styles.filterButton} ${
              filter.lowToHigh ? styles.activeButton : ""
            }`}
            onClick={() => handleFilter("lowToHigh")}
          >
            Low To High <i class="fa-solid fa-sort"></i>
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
    </>
  );
}

export default Home;
