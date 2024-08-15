import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout';
import axios from 'axios';
import { message, Table } from 'antd';

const Doctors = () => {

    const [doctors, setDoctors] = useState([]);


    const handleAccountStatus = async(record,status) => {
      try {
         const response = await axios.post(
             "http://localhost:8080/api/admin/changestatus",
           {doctorId:record._id,userId:record.userId,status:status},
           {
             headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
             },
           }
          );
          if (response.data.success) {
              message.success(response.data.success);
              window.location.reload();
          }
      } catch (error) {
          message.error("something went wrong");
      }
  }



    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/getalldoctors",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setDoctors(response.data.data);
        } else {
          console.error("Failed to fetch doctors:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    useEffect(() => {
      fetchDoctors();
    }, []);

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        render: (text, record) => (
          <span>
            {record.firstName} {record.secondName}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
      },
      {
        title: "Phone",
        dataIndex: "phone",
      },
      {
        title: "Actions",
        dataIndex: "actions",
        render: (text, record) => (
          <div className="d-flex">
            {record.status === "pending" ? (
              <button className="btn btn-success" onClick={()=>{handleAccountStatus(record,"Approved")}}>Approve</button>
            ) : (
              <button className="btn btn-danger">Reject</button>
            )}
          </div>
        ),
      },
    ];
  return (
    <Layout>
      <h1 className="text-center m-2">Doctors List</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
}

export default Doctors