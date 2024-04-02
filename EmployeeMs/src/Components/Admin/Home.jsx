/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserTie, FaUsers, FaDollarSign } from "react-icons/fa";
import Appointments from "./Appointments";
import {
  LineChart,
  Line,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./style.css";

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);

  const data = [
    { name: "Mon", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Tue", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Wed", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Thur", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Fri", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Sat", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Sun", uv: 3490, pv: 4300, amt: 2100 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminCountResponse = await axios.get(
          "http://localhost:3000/auth/admin_count"
        );
        const employeeCountResponse = await axios.get(
          "http://localhost:3000/auth/employee_count"
        );
        const salaryCountResponse = await axios.get(
          "http://localhost:3000/auth/salary_count"
        );
        const adminRecordsResponse = await axios.get(
          "http://localhost:3000/auth/admin_records"
        );

        if (adminCountResponse.data.Status) {
          setAdminTotal(adminCountResponse.data.Result[0].admin);
        }
        if (employeeCountResponse.data.Status) {
          setEmployeeTotal(employeeCountResponse.data.Result[0].employee);
        }
        if (salaryCountResponse.data.Status) {
          setSalaryTotal(salaryCountResponse.data.Result[0].salaryOFEmp);
        }
        if (adminRecordsResponse.data.Status) {
          setAdmins(adminRecordsResponse.data.Result);

          // Update status of logged-in user to "active"
          const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
          if (loggedInUser) {
            await axios.post("http://localhost:3000/auth/update_status", {
              email: loggedInUser.email,
              status: "active",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <div className="stats-section">
        {/* Admin Card */}
        <div className="MuiPaper-root MuiCard-root MuiPaper-elevation1 MuiPaper-rounded">
          <div className="MuiCardContent-root">
            <div className="card-content">
              <div>
                <h3
                  className="MuiTypography-root MuiTypography-h3"
                  style={{ color: "rgb(0, 123, 255)" }}
                >
                  {adminTotal}
                </h3>
                <h6 className="MuiTypography-root jss85 MuiTypography-subtitle1">
                  Admins
                </h6>
              </div>
              <div>
                <h2
                  className="MuiTypography-root MuiTypography-h2"
                  style={{ color: "rgb(0, 123, 255)" }}
                >
                  <FaUserTie />
                </h2>
              </div>
            </div>
          </div>
          <div className="MuiGrid-root jss86">
            <div className="card-content">
              <p className="MuiTypography-root MuiTypography-body2">
                10% changes on Users
              </p>
              <p className="MuiTypography-root MuiTypography-body2">
                <svg
                  className="MuiSvgIcon-root"
                  focusable="false"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"></path>
                </svg>
              </p>
            </div>
          </div>
        </div>

        {/* Employee Card */}
        <div className="MuiPaper-root MuiCard-root MuiPaper-elevation1 MuiPaper-rounded">
          <div className="MuiCardContent-root">
            <div className="card-content">
              <div>
                <h3
                  className="MuiTypography-root MuiTypography-h3"
                  style={{ color: "rgb(0, 123, 255)" }}
                >
                  {employeeTotal}
                </h3>
                <h6 className="MuiTypography-root jss85 MuiTypography-subtitle1">
                  Employees
                </h6>
              </div>
              <div>
                <h2
                  className="MuiTypography-root MuiTypography-h2"
                  style={{ color: "rgb(0, 123, 255)" }}
                >
                  <FaUsers />
                </h2>
              </div>
            </div>
          </div>
          <div className="MuiGrid-root jss86">
            <div className="card-content">
              <p className="MuiTypography-root MuiTypography-body2">
                10% of New Employees
              </p>
              <p className="MuiTypography-root MuiTypography-body2">
                <svg
                  className="MuiSvgIcon-root"
                  focusable="false"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"></path>
                </svg>
              </p>
            </div>
          </div>
        </div>

        {/* Salary Card */}
        <div className="MuiPaper-root MuiCard-root MuiPaper-elevation1 MuiPaper-rounded">
          <div className="MuiCardContent-root">
            <div className="card-content">
              <div>
                <h3
                  className="MuiTypography-root MuiTypography-h3"
                  style={{ color: "rgb(0, 123, 255)" }}
                >
                  ${salaryTotal.toLocaleString()}
                </h3>
                <h6 className="MuiTypography-root jss85 MuiTypography-subtitle1">
                  Salary Earnings
                </h6>
              </div>
              <div>
                <h2
                  className="MuiTypography-root MuiTypography-h2"
                  style={{ color: "rgb(0, 123, 255)" }}
                >
                  <FaDollarSign />
                </h2>
              </div>
            </div>
          </div>
          <div className="MuiGrid-root jss86">
            <div className="card-content">
              <p className="MuiTypography-root MuiTypography-body2">
                10% changes on profit
              </p>
              <p className="MuiTypography-root MuiTypography-body2">
                <svg
                  className="MuiSvgIcon-root"
                  focusable="false"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"></path>
                </svg>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="admin-and-calendar-section"
        style={{ display: "flex", gap: "20px", marginTop: "20px" }}
      >
        <div
          className="admin-list-section"
          style={{ flex: 2, maxWidth: "60%" }}
        >
          <h2>List Of Admins</h2>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr key={admin.id}>
                  <td>{index + 1}</td>
                  <td>{admin.email}</td>
                  <td
                    style={{
                      color: admin.status === "active" ? "green" : "inherit",
                    }}
                  >
                    {admin.status === "active" ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="appointment-calendar"
          style={{
            flex: 1,
            maxWidth: "4000px", // Adjusted from "4000px" to "400px" for a reasonable width, or keep it as per your need
            height: "300px", // Set a specific height to reduce its size
            padding: "0px",
            borderRadius: "8px",
            textAlign: "center",
            overflow: "auto", // Allow scrolling for overflowing content
          }}
          
        >
          <h2>Appointment Calendar</h2>
          <Appointments />
        </div>
      </div>

      <div className="chart-section">
        <h2>Latest Activity</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="uv"
              stroke="#82ca9d"
              strokeDasharray="3 4 5 2"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Home;
