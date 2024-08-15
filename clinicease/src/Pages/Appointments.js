import React, { useEffect, useState } from 'react'
import Layout from '../Components/Layout';
import moment from 'moment';
import axios from 'axios';
import { Table } from 'antd';

const Appointments = () => {
    const [appointment, setAppointments] = useState([]);

    const getAppointments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/users/userappointments",
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
    ];

    return (
      <Layout>
            <h1>Appointments</h1>
            <Table columns={columns} dataSource={appointment} />
      </Layout>
    );
}

export default Appointments