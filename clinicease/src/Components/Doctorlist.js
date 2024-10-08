import React from 'react'
import { useNavigate } from 'react-router-dom';
const Doctorlist = ({ doctor }) => {
    const navigate = useNavigate();
  return (
    <>
      <div className="card m-2" style={{cursor:"pointer"}} onClick={()=>navigate(`/doctor/book-appointment/${doctor._id}`)}>
        <div className="card-header">
          Dr. {doctor.firstName} {doctor.lastName}
        </div>
        <div className="card-body">
          <p>
            <b>Specialisation : </b>
            {doctor.specialisation}
          </p>
          <p>
            <b>Experience : </b>
            {doctor.experience}
          </p>
          <p>
            <b>Consultation Fee : </b>
            {doctor.fee}
          </p>
          <p>
            <b>Timing : </b>
            {doctor.timing[0]}-{doctor.timing[1]}
          </p>
        </div>
      </div>
    </>
  );
}

export default Doctorlist