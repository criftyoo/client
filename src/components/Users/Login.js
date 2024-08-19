import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { login } from "../../redux/modules/users";
import { showAlertMessage } from "../../redux/modules/alerts";

const Login = ({ login, showAlertMessage, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    return setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    login({ email, password });
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className=" main register">
      <p align="center" className="form-title">
        Sign In
      </p>
      <form className="form1" onSubmit={onSubmit}>
        <input
          className="input-text"
          type="text"
          placeholder="Email Address"
          align="center"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        
        <input
          className="input-text"
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => onChange(e)}
          minLength="6"
        />
        
        <input
          type="submit"
          className="btn btn-primary"
          style={{ marginLeft: "36%" }}
          value="Login"
        />
        <p className="forgot" align="center">
          New to Scheduler? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};




const mapStateToProps = (state) => ({
  isAuthenticated: state.users.isAuthenticated,
});

export default connect(mapStateToProps, { login, showAlertMessage })(Login);