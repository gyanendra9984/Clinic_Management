import Layout from "./../Components/Layout";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Doctorlist from "../Components/Doctorlist";
import { Row } from "antd";

const Homepage = () => {
  const [doctors, setDoctors] = useState([]);
  const getUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/users/getalldoctor",
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

  useEffect(() => {
    getUserData();
    console.log(doctors);
  }, []);

  return (
    <Layout>
      <h1 className="text-center">Homepage</h1>
      <Row>
        {doctors && doctors.map((doctor) => 
          <Doctorlist doctor={doctor} />
        )

        }
      </Row>
    </Layout>
  );
};

export default Homepage;
