/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Calendar } from "antd";
import { FileOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons'; // Import icons from Ant Design
import './empstyle.css'; // Import CSS file for styling

const EmployeeHome = () => {
  const [taskCount, setTaskCount] = useState(0);
  const [timesheetCount, setTimesheetCount] = useState(0);
  const [payslipCount, setPayslipCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountsAndData = async () => {
      try {
        const id = localStorage.getItem("employee_id");
        const [
          tasksResponse,
          timesheetsResponse,
          payslipsCountResponse // Fetch payslip count from the new endpoint
        ] = await Promise.all([
          axios.get(`http://localhost:3000/employee/employee_tasks/${id}`),
          axios.get(`http://localhost:3000/employee/employee_timesheet/${id}`),
          axios.get(`http://localhost:3000/employee/payslip_count/${id}`) // Fetch payslip count
        ]);

        if (tasksResponse.data.Status) {
          setTasks(tasksResponse.data.Result);
          setTaskCount(tasksResponse.data.Result.length);
        } else {
          console.error("Error fetching tasks:", tasksResponse.data.Error);
        }

        if (timesheetsResponse.data.Status) {
          setTimesheets(timesheetsResponse.data.Result);
          setTimesheetCount(timesheetsResponse.data.Result.length);
        } else {
          console.error("Error fetching timesheets:", timesheetsResponse.data.Error);
        }

        if (payslipsCountResponse.data.Status) {
          setPayslipCount(payslipsCountResponse.data.Result[0].payslips); // Extract payslip count from response
        } else {
          console.error("Error fetching payslip count:", payslipsCountResponse.data.Error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountsAndData();
  }, []);

  // Function to format the deadline date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format the date in the user's locale
  };

  return (
    <div className="employee-home-container">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card
            title={<span><FileOutlined /> Tasks</span>}
            hoverable
            className="home-card"
          >
            View your tasks
            <div className="card-info">Total: {taskCount}</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title={<span><CalendarOutlined /> Timesheets</span>}
            hoverable
            className="home-card"
          >
            View your timesheets
            <div className="card-info">Total: {timesheetCount}</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title={<span><DollarOutlined /> Payslips </span>}
            hoverable
            className="home-card"
          >
            View your payslips
            <div className="card-info">Total: {payslipCount}</div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={16}>
          <div className="task-calendar-container">
            <div className="task-section">
              <h2>Your Tasks</h2>
              <table className="task-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={task.id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                      <td>{index + 1}</td>
                      <td>{task.name}</td>
                      <td>{formatDate(task.deadline)}</td> {/* Format the deadline date */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="calendar-container">
              <Calendar fullscreen={false} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeHome;
