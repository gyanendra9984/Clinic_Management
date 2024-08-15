import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import { useParams } from 'react-router-dom';
import moment from 'moment';

import { Form, Input, Row, Col, Button, TimePicker, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";

const Profile = () => {
        const {user} = useSelector((state) => state.user);
    const [doctor, setDoctor] = useState(null);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFinish = async (values) => {
      try {
        dispatch(showLoading());
        const res = await axios.post(
          "http://localhost:8080/api/doctor/updateprofile",
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
          navigate("/");
        } else {
          message.error(res.data.success);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.log(error);
        message.error("something went wrong");
      }
    };

    const fetchDoctorInfo = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/doctor/getdoctorinfo",
                { userId: params.id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success) {
                setDoctor(response.data.data);
            } else {
             message.error(response.data.message);
            }
        } catch (error) {
            console.log("Error fetching doctor information:", error);
        }
    };

     useEffect(() => {
       fetchDoctorInfo();
     }, []);

  return (
    <Layout>
      <h1>profile page</h1>
      {doctor && (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            ...doctor,
            timing: [
              moment(doctor.timing[0], "HH:mm"),
              moment(doctor.timing[1], "HH:mm"),
            ],
          }}
        >
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
              Update Application
            </Button>
          </div>
        </Form>
      )}
    </Layout>
  );
}

export default Profile