import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isavailable, setIsavailable] = useState();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getUserData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/doctor/getdoctorbyid",
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBooking = async () => {
      try {
          if (!date || !time) {
              alert("Date and Time Required!");
        }
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/users/bookappointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
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
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

    
    const handleAvailability = async () => {
      try {
        dispatch(showLoading());
        const res = await axios.post(
          "http://localhost:8080/api/users/bookavailability",
          {
            doctorId: params.doctorId,
            date,
            time,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());
        if (res.data.success) {
          setIsavailable(true);
          message.success(res.data.message);
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.log(error);
      }
    };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Layout>
      <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Booking Page</h3>
      <div className="container m-7" style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
        {doctors && (
          <div style={{ padding: "20px", borderRadius: "8px" }}>
            <h4 style={{ fontWeight: "bold", color: "#333" }}>
              Dr. {doctors.firstName} {doctors.lastName}
            </h4>
            <h4 style={{ fontSize: "16px", marginTop: "10px", color: "#666" }}>Fees: {doctors.fee}</h4>
            {doctors.timing && doctors.timing.length > 1 ? (
              <h4 style={{ fontSize: "16px", marginTop: "10px", color: "#666" }}>
                Timing: {doctors.timing[0]} - {doctors.timing[1]}
              </h4>
            ) : (
              <h4 style={{ fontSize: "16px", marginTop: "10px", color: "#ff4d4f" }}>Timing information is not available.</h4>
            )}
            <div className="d-flex flex-column w-50" style={{ marginTop: "20px" }}>
              <DatePicker
                format="DD-MM-YYYY"
                className="m-2"
                onChange={(value) => {
                  setIsavailable(false);
                  setDate(moment(value).format("DD-MM-YYYY"));
                }}
                style={{ padding: "10px", borderRadius: "8px", borderColor: "#04AA6D", marginBottom: "15px" }}
              />
              <TimePicker
                format="HH:mm"
                className="m-2"
                onChange={(value) => {
                  setIsavailable(false);
                  setTime(moment(value).format("HH:mm"));
                }}
                style={{ padding: "10px", borderRadius: "8px", borderColor: "#04AA6D", marginBottom: "15px" }}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
                style={{ backgroundColor: "#007bff", borderColor: "#007bff", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold" }}
              >
                Check Availability
              </button>
              {!isavailable && (
                <button
                  className="btn mt-2"
                  style={{ backgroundColor: "#04AA6D", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", marginTop: "15px" }}
                  onClick={handleBooking}
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
