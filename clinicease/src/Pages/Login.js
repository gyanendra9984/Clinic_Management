import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { showLoading,hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

const Login = () => {
  const [formValues, setFormValues] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginHandler = async () => {
    try {
      const { email, password } = formValues;
      if (!email || !password) {
        message.error("Email and password are required.");
        return;
      }
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        { email, password }
      );
      window.location.reload();
     dispatch(hideLoading());
      if (response.data.success) {
        message.success("Login successful.");
        localStorage.setItem("token", response.data.token);
        navigate("/"); 
      } else {
        message.error(response.data.message || "Login failed.");
      }
    } catch (error) {
     dispatch(hideLoading());
      message.error(
        error.response?.data?.message || "An error occurred during login."
      );
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
    }
  };

  const onFormChange = (changedValues) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...changedValues,
    }));
  };

  return (
    <div className="container d-flex justify-content-center">
      <div
        className="text-center mt-5 py-1 px-5"
        style={{
          backgroundColor: "white",
          color: "black",
          borderRadius: "8px",
          position: "absolute",
          top: "-30px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ margin: 0 }}>ClinicEase</h1>
      </div>
      <div
        style={{
          minWidth: "280px",
          marginTop: "85px",
          position: "relative",
        }}
      >
        <Form
          layout="vertical"
          onValuesChange={onFormChange}
          className="p-3 border rounded bg-white w-100"
          style={{
            paddingTop: "60px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
            labelCol={{ style: { fontWeight: "bold" } }}
          >
            <Input type="email" placeholder="Enter Your Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
            labelCol={{ style: { fontWeight: "bold" } }}
          >
            <Input type="password" placeholder="Enter Your Password" />
          </Form.Item>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate("/signup")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: "5px 20px",
                textAlign: "center",
              }}
            >
              Signup
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={loginHandler}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: "5px 20px",
                textAlign: "center",
              }}
            >
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
