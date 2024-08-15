import React from "react";
import "../styles/layout.css"
import { adminmenu, usermenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";


const Layout = ({ children }) => {
    const location = useLocation();
  const { user } = useSelector(state => state.user)
  const doctormenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctorappointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];
  const sidebarmenu = user?.IsAdmin ? adminmenu : user?.IsDoctor ? doctormenu : usermenu;
  const navigate = useNavigate();
  

  const handlelogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate('/login');
  }
  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h3>ClinicEase</h3>
              <hr />
            </div>
            <div className="menu">
              {sidebarmenu.map((menu) => {
                const isactive = location.pathname === menu.path;
                return (
                  <>
                    <div className={`menuitem ${isactive && "active"}`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  </>
                );
              })}
              <div className="menuitem" onClick={handlelogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="headercontent" style={{ cursor: "pointer" }}>
                <Badge
                  count={user && user.Notification.length}
                  onClick={() => {
                    navigate("/getallnotification");
                  }}
                >
                  <i class="fa-solid fa-bell"></i>
                </Badge>
                <Link
                  to="/profile"
                >
                  {user?.name}
                </Link>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
