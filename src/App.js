import Navbar from "./pages/navbar/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Cart from "./pages/cart/cart/cart";
import Error from "./utility/error/error";
import OrderList from "./pages/order/orderList/orderList";
import OrderDetails from "./pages/order/orderDetails/orderDetails";
import { Provider } from "react-redux";
import { store } from "./store";
import ProtectedRoute from "./utility/protectedRoutes/protected";
import Product from "./pages/product/product/product";
import ProductDetails from "./pages/product/productDetails/productDetails";
import UpdateProduct from "./pages/product/update/updateProduct";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "products/:productId/details",
          element: <ProductDetails />,
        },
        {
          path: "products/:productId/update",
          element: <UpdateProduct />,
        },
        {
          path: "products",
          element: (
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          ),
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: ":userId/cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: ":userId/order",
          element: (
            <ProtectedRoute>
              <OrderList />{" "}
            </ProtectedRoute>
          ),
        },
        {
          path: ":userId/order/:orderId",
          element: (
            <ProtectedRoute>
              <OrderDetails />{" "}
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
