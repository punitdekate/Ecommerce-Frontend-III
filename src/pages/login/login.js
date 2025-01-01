import { Link } from "react-router-dom";
import styles from "./login.module.css";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin } from "../../redux/reducers/user.reducer";
import { userSelector } from "../../redux/reducers/user.reducer";
import { useSelector } from "react-redux";
function Login() {
  /** Define the user state */
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  /** Get the state from user to check user is LoggedIn or not */
  const { isLoggedIn } = useSelector(userSelector);

  /**To keep focus on email field defining useRef */
  const emailRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**Set the focus on email field */
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  /** Handle the login action */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (user.email && user.password) {
      await dispatch(userLogin(user));
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <form onSubmit={(e) => handleLogin(e)}>
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>Login</div>
        <div className={styles.loginEmail}>
          <Label name="Email" />
          <input
            type="email"
            className={styles.loginEmailInput}
            placeholder="abc@example.com"
            value={user.email}
            onChange={(e) =>
              setUser({
                name: user.name,
                email: e.target.value,
                password: user.password,
              })
            }
            ref={emailRef}
          />
        </div>
        <div className={styles.loginPassword}>
          <Label name="Password" />
          <input
            type="password"
            className={styles.loginPasswordInput}
            value={user.password}
            onChange={(e) =>
              setUser({
                name: user.name,
                email: user.email,
                password: e.target.value,
              })
            }
          />
        </div>
        <div>
          <button type="submit" className={styles.loginButton}>
            Sign In
          </button>
          <Link to="/register">
            <button className={styles.loginButton}>Sign Up</button>
          </Link>
        </div>
      </div>
    </form>
  );
}

function Label(props) {
  return <label className={styles.loginLabel}>{props.name}</label>;
}

export default Login;
