import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import landing from "../../assets/landing.jpg";
import styles from "./Landing.module.css";

function Landing() {
  const [logStatus, setLogStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userId");
    if (token) {
      setLogStatus(true);
    } else {
      setLogStatus(false);
    }
    setLoading(false); // Mark token-checking as complete
  }, []);

  if (loading) {
    // Render nothing or a loader while checking token
    return null;
  }

  return (
    <div>
      <Navbar active={"home"} />
      <div className={styles.landing__wrapper}>
        <div className={styles.landing__text}>
          <h1>
            Schedule Your Teams Daily Tasks With{" "}
            <span className="primaryText">DoDo!</span>
          </h1>
          {!logStatus && (
            <div className="btnWrapper">
              <Link to="/register" className="primaryBtn">
                Register
              </Link>
              <Link to="/login" className="secondaryBtn">
                Login
              </Link>
            </div>
          )}
        </div>

        <div className={styles.landing__img}>
          <img src={landing} alt="landing" />
        </div>
      </div>
    </div>
  );
}

export default Landing;
