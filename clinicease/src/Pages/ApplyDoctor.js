import React from "react";
import Layout from "../Components/Layout";
import { Form, Input, Row, Col, Button, TimePicker, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import moment from 'moment'

const ApplyDoctor = () => {
    const {user} = useSelector(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFinish = async(values) => {
        try {
          dispatch(showLoading())
        const res = await axios.post(
          "http://localhost:8080/api/users/applydoctor",
          {
            ...values,
            userId: user._id,
            timing: [
              moment(values.timing[0]).format("HH:mm"),
              moment(values.timing[1]).format("HH:mm"),
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate('/');
        } else {
          message.error(res.data.message);
        }
        } catch (error) {
          dispatch(hideLoading());
          console.log(error);
          message.error("something went wrong");
      }
  };

  return (
    <Layout>
      <h1 className="text-center">Apply Doctor</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <Row gutter={16}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              required
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              required
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              required
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Email"
              name="email"
              required
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Address"
              name="address"
              required
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Specialisation"
              name="specialisation"
              required
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your specialization" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Experience (in years)"
              name="experience"
              required
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your experience in years" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Consultation Fee"
              name="fee"
              required
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your consultation fee" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Timings"
              name="timing"
              required
              rules={[
                {
                  required: true,
                  message: "Please select consultation timings",
                },
              ]}
            >
              <TimePicker.RangePicker
                format="HH:mm"
                placeholder={["Start Time", "End Time"]}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="d-flex justify-content-center mt-4">
          <Button type="primary" htmlType="submit">
            Submit Application
          </Button>
        </div>
      </Form>
    </Layout>
  );
};

export default ApplyDoctor;
