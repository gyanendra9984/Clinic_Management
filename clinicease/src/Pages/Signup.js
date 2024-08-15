import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupHandler = async () => {
    try {
      const { name, email, password } = formValues;

      if (!name || !email || !password) {
        message.error("Name, email, and password are required.");
        return;
      }
     dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:8080/api/users/signup",
        { name, email, password }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        message.success("Registration successful.");
      } else {
        message.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      dispatch(hideLoading());
      // Display error from backend if available, otherwise a generic message
      message.error(
        error.response?.data?.message ||
          "An error occurred during registration."
      );
      console.error(
        "Error during registration:",
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
          form={form}
          layout="vertical"
          onValuesChange={onFormChange}
          className="p-3 border rounded bg-white w-100"
          style={{
            paddingTop: "60px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
            labelCol={{ style: { fontWeight: "bold" } }}
          >
            <Input placeholder="Enter Your Name" />
          </Form.Item>
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
            <Button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate("/login")}
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
            </Button>
            <Button
              className="btn btn-primary"
              type="button"
              onClick={signupHandler}
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
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
