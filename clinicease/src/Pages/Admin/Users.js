import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import axios from 'axios';
import { Table } from 'antd';

const Users = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/getallusers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ); 
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          console.error("Failed to fetch users:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    useEffect(() => {
        fetchUsers();
        console.log(users,"jjjjjjjjjjjjjjjjjj");
    }, [])
    
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Doctor",
        dataIndex: "IsDoctor",
        render: (text, record) => (
            <span>{record.IsDoctor ? "yes" :"no"}</span>
        ),
      },
      {
        title: "Actions",
        dataIndex: "actions",
        render: (text, record) => (
          <div className="d-flex">
            <button className="btn btn-danger">Block</button>
          </div>
        ),
      },
    ];

    return (
        <Layout>
            <h1 className='text-center m-2'>Users List</h1>
            <Table columns={columns} dataSource={users}/>
      </Layout>
  )
}

export default Users