import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/reducers/error.reducer";
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  // If the user is not logged in, redirect to login page
  if (!isLoggedIn) {
    dispatch(
      setError({
        message: "Please log in to your account.",
      })
    );
    return <Navigate to="/" replace />;
  }

  // If the user is logged in, render the protected component (children)
  return children;
};

export default ProtectedRoute;
