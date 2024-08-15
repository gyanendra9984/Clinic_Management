import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { message, Table } from "antd";
import Layout from "../../Components/Layout";

const DoctorAppointments = () => {
  const [appointment, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/doctor/doctorappointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        console.log("appointment", res.data);
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

    
    const handleStatus = async (record, status) => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/doctor/updatestatus",
          { appointmentId: record._id, status },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          message.success(res.data.message);
          getAppointments(); 
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        message.error("Something went wrong");
      }
    };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    //   {
    //     title: "Name",
    //     dataIndex: "name",
    //     render: (text, record) => (
    //       <span>
    //         {record.doctorId.firstName} {record.doctorId.lastName}
    //       </span>
    //     ),
    //   },
    //   {
    //     title: "Phone",
    //     dataIndex: "phone",
    //     render: (text, record) => <span>{record.doctorId.phone}</span>,
    //   },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <button
                className="btn btn-success "
                onClick={() => handleStatus(record, "approved")}
              >
                Approved
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleStatus(record, "rejected")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1>Appointments</h1>
      <Table columns={columns} dataSource={appointment} />
    </Layout>
  );
};

export default DoctorAppointments;
