import { configureStore } from "@reduxjs/toolkit";
import { productListReducer } from "./redux/reducers/productList.reducer";
import { userReducer } from "./redux/reducers/user.reducer";
import { categoriesReducer } from "./redux/reducers/productCategories.reducer";
import { loaderReducer } from "./redux/reducers/loader.reducer";
import { cartReducer } from "./redux/reducers/cart.reducer";
import { ordersReducer } from "./redux/reducers/orders.reducer";
import { placeOrderReducer } from "./redux/reducers/placeOrder.reducer";
import { errorReducer } from "./redux/reducers/error.reducer";
export const store = configureStore({
  reducer: {
    productListReducer,
    userReducer,
    categoriesReducer,
    loaderReducer,
    cartReducer,
    ordersReducer,
    placeOrderReducer,
    errorReducer,
  },
});
