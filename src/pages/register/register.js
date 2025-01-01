import { Link, useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import { userRegister } from "../../redux/reducers/user.reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";

function Register() {
  /** Defining the state for userRegistration */
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** Handling user registration */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (userData.name && userData.email && userData.password) {
      await dispatch(userRegister(userData)).unwrap();
      navigate("/login");
    }
  };

  return (
    <form onSubmit={(e) => handleRegister(e)}>
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>Register</div>
        <div className={styles.loginEmail}>
          <Label name="Name" />
          <input
            type="text"
            className={styles.loginEmailInput}
            value={userData.name}
            onChange={(e) =>
              setUserData({
                name: e.target.value,
                email: userData.email,
                password: userData.password,
                role: userData.role,
              })
            }
            required
          />
        </div>
        <div className={styles.loginEmail}>
          <Label name="Email" />
          <input
            type="email"
            className={styles.loginEmailInput}
            value={userData.email}
            onChange={(e) =>
              setUserData({
                name: userData.name,
                email: e.target.value,
                password: userData.password,
                role: userData.role,
              })
            }
            required
          />
        </div>
        <div className={styles.loginPassword}>
          <Label name="Password" />
          <input
            type="password"
            className={styles.loginPasswordInput}
            value={userData.password}
            onChange={(e) =>
              setUserData({
                name: userData.name,
                email: userData.email,
                password: e.target.value,
                role: userData.role,
              })
            }
            required
          />
        </div>
        <div>
          <button className={styles.loginButton} type="submit">
            Sign Up
          </button>
          <Link to="/login">
            <button className={styles.loginButton}>Sign In</button>
          </Link>
        </div>
      </div>
    </form>
  );
}

function Label(props) {
  return <label className={styles.loginLabel}>{props.name}</label>;
}

export default Register;
