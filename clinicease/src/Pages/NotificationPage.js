import React from "react";
import Layout from "../Components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { message, Tabs } from "antd";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
    const navigate = useNavigate();
    
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:8080/api/users/getallnotification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.success);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());

      console.error(error);
      message.error("error occurred marking notifications as read.");
    }
  };
    const handleDeleteAllRead = async() => {
      try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:8080/api/users/deleteallnotification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.success);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("something went wrong");
    }
  };
  return (
    <Layout>
      <h4 className="p-4 text-center">Notification Page</h4>
      <Tabs>
        <Tabs.TabPane tab="Unread" key="0">
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-end mb-2">
              <h4
                className="p-2 text-primary"
                style={{ cursor: "pointer", marginLeft: "auto" }}
                onClick={handleMarkAllRead}
              >
                Mark All Read
              </h4>
            </div>
            <div className="d-flex flex-column">
              {user?.Notification.map((msg) => (
                <div
                  key={msg._id} 
                  className="card m-2"
                  onClick={() => navigate(msg.onClickPath)}
                >
                  <div className="m-2 card-text">{msg.message}</div>
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key="1">
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-end mb-2">
              <h4
                className="p-2 text-primary"
                style={{ cursor: "pointer", marginLeft: "auto" }}
                onClick={handleDeleteAllRead}
              >
                Delete All Read
              </h4>
            </div>
            <div className="d-flex flex-column">
              {user?.SeenNotification.map((msg) => (
                <div
                  key={msg._id} 
                  className="card mb-2"
                  onClick={() => navigate(msg.onClickPath)}
                >
                  <div className="card-text">{msg.message}</div>
                </div>
              ))}
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
