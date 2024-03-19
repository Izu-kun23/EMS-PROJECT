import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import TaskIcon from "@mui/icons-material/Task";
import MenuIcon from "@mui/icons-material/Menu"; // Icon for the collapsed state
import CloseIcon from "@mui/icons-material/Close"; // Icon for the expanded state
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import "./style.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  axios.defaults.withCredentials = true;

  const handleLogout = async () => {
    try {
      const result = await axios.get("http://localhost:3000/auth/logout");
      if (result.data.Status) {
        localStorage.removeItem("valid");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="dashboard-container">
      <button className="menu-toggle" onClick={toggleSidebarCollapse}>
        {isSidebarCollapsed ? <MenuIcon /> : <CloseIcon />}
      </button>

      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img
            src="/Images/logopic.png"
            alt="CALAYA ENTERPRISES"
            className="logo"
          />
        </div>

        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <Link to="/dashboard" className="nav-link text-white">
              <DashboardRoundedIcon />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/employee" className="nav-link text-white">
              <PeopleRoundedIcon />
              <span>Manage Employees</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/category" className="nav-link text-white">
              <ClassRoundedIcon />
              <span>Category</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/task" className="nav-link text-white">
              <TaskIcon />
              <span>Tasks</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/users" className="nav-link text-white">
              <InsertEmoticonIcon />
              <span>Manage Users</span>
            </Link>
          </li>
          <li>
            <button
              className="nav-link text-white btn-logout"
              onClick={handleLogout}
              style={{ background: "none", border: "none" }}
            >
              <LogoutRoundedIcon />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </aside>

      <main className={`main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <div className="header p-2 d-flex justify-content-center shadow">
          <h4>EMPLOYEE MANAGEMENT SYSTEM</h4>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

// import React, { useState } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import axios from 'axios';
// import './style.css';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   axios.defaults.withCredentials = true;

//   const handleLogout = () => {
//     axios.get('http://localhost:3000/auth/logout').then((result) => {
//       if (result.data.Status) {
//         localStorage.removeItem('valid');
//         navigate('/');
//       }
//     });
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="dashboard-container">
//       <button
//         className={`menu-toggle ${isSidebarOpen ? 'open' : ''}`}
//         onClick={toggleSidebar}
//       >
//         <i className={`bi ${isSidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
//       </button>

//       <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
//       <ul
//               className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
//               id="menu"
//             >
// <li className="w-100">
//   <Link
//     to="/dashboard"
//     className="nav-link text-white px-0 align-middle"
//   >
//     <i className="fs-4 bi-speedometer2 ms-2"></i>
//     <span className="ms-2 d-none d-sm-inline">Dashboard</span>
//   </Link>
// </li>
// <li className="w-100">
//   <Link
//     to="/dashboard/employee"
//     className="nav-link px-0 align-middle text-white"
//   >
//     <i className="fs-4 bi-people ms-2"></i>
//     <span className="ms-2 d-none d-sm-inline">
//       Manage Employees
//     </span>
//   </Link>
// </li>
// <li className="w-100">
//   <Link
//     to="/dashboard/category"
//     className="nav-link px-0 align-middle text-white"
//   >
//     <i className="fs-4 bi-columns ms-2"></i>
//     <span className="ms-2 d-none d-sm-inline">Category</span>
//   </Link>
// </li>
// <li className="w-100">
//   <Link
//     to="/dashboard/profile"
//     className="nav-link px-0 align-middle text-white"
//   >
//     <i className="fs-4 bi-person ms-2"></i>
//     <span className="ms-2 d-none d-sm-inline">Profile</span>
//   </Link>
// </li>
// <li className="w-100" onClick={handleLogout}>
//   <Link
//     className="nav-link px-0 align-middle text-white"
//   >
//     <i className="fs-4 bi-power ms-2"></i>
//     <span className="ms-2 d-none d-sm-inline">Logout</span>
//   </Link>
// </li>
//             </ul>
//           </div>
//         </div>
//       </aside>

//       <main className="main-content">
//           <h4>EMPLOYEE MANAGEMENT SYSTEM</h4>
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

// Dashboard.js
// import React, { useState } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import axios from 'axios';
// import './style.css'; // Include your style file here

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start with the sidebar closed on mobile

//   axios.defaults.withCredentials = true;

//   const handleLogout = () => {
//     axios.get('http://localhost:3000/auth/logout').then((result) => {
//       if (result.data.Status) {
//         localStorage.removeItem('valid');
//         navigate('/');
//       }
//     });
//   };

//   // Toggle sidebar function
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row flex-nowrap">
//         {/* Add a button to toggle the sidebar */}
//         <button
//           className="btn btn-primary d-md-none"
//           type="button"
//           onClick={toggleSidebar}
//           aria-controls="sidebar"
//           aria-expanded={isSidebarOpen}
//         >
//           {isSidebarOpen ? (
//             <i className="bi bi-arrow-left"></i>
//           ) : (
//             <i className="bi bi-list"></i>
//           )}
//         </button>

//         {/* Sidebar */}
//         <div className={`col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark ${isSidebarOpen ? '' : 'collapsed'}`}>
//           <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
// <Link
//   to="/dashboard"
//   className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
// >
//   <img src="public/Images/logopic.png" alt="CALAYA ENTERPRISES" className="logo" />
// </Link>
// <ul
//   className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
//   id="menu"
// >
//               <li className="w-100">
//                 <Link
//                   to="/dashboard"
//                   className="nav-link text-white px-0 align-middle"
//                 >
//                   <i className="fs-4 bi-speedometer2 ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">Dashboard</span>
//                 </Link>
//               </li>
//               <li className="w-100">
//                 <Link
//                   to="/dashboard/employee"
//                   className="nav-link px-0 align-middle text-white"
//                 >
//                   <i className="fs-4 bi-people ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">
//                     Manage Employees
//                   </span>
//                 </Link>
//               </li>
//               <li className="w-100">
//                 <Link
//                   to="/dashboard/category"
//                   className="nav-link px-0 align-middle text-white"
//                 >
//                   <i className="fs-4 bi-columns ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">Category</span>
//                 </Link>
//               </li>
//               <li className="w-100">
//                 <Link
//                   to="/dashboard/profile"
//                   className="nav-link px-0 align-middle text-white"
//                 >
//                   <i className="fs-4 bi-person ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">Profile</span>
//                 </Link>
//               </li>
//               <li className="w-100" onClick={handleLogout}>
//                 <Link
//                   className="nav-link px-0 align-middle text-white"
//                 >
//                   <i className="fs-4 bi-power ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">Logout</span>
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="col p-0 m-0">
//           <div className="p-2 d-flex justify-content-center shadow">
//             <h4>EMPLOYEE MANAGEMENT SYSTEM</h4>
//           </div>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
