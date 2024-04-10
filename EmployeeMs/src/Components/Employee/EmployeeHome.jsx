/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "antd";
import { FileOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons'; // Import icons from Ant Design

const EmployeeHome = () => {
  const [taskCount, setTaskCount] = useState(0);
  const [timesheetCount, setTimesheetCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const id = localStorage.getItem("employee_id");
        const [
          tasksResponse,
          timesheetResponse
        ] = await Promise.all([
          axios.get(`http://localhost:3000/employee/employee_tasks/${id}`),
          axios.get(`http://localhost:3000/employee/timesheet_count/${id}`)
        ]);

        if (tasksResponse.data.Status) {
          setTasks(tasksResponse.data.Result);
          setTaskCount(tasksResponse.data.Result.length);
        } else {
          console.error("Error fetching tasks:", tasksResponse.data.Error);
        }

        if (timesheetResponse.data.Status) {
          setTimesheetCount(timesheetResponse.data.count);
        } else {
          console.error("Error fetching timesheet count:", timesheetResponse.data.Error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card
            title={
              <div>
                <FileOutlined /> Tasks
              </div>
            }
            hoverable
          >
            View your tasks
            <div>Total: {taskCount}</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title={
              <div>
                <CalendarOutlined /> Timesheets
              </div>
            }
            hoverable
          >
            View your timesheets
            <div>Total: {timesheetCount}</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title={
              <div>
                <DollarOutlined /> Payslips
              </div>
            }
            hoverable
          >
            View your payslips
          </Card>
        </Col>
      </Row>
      {/* Render tasks below the cards */}
      <div>
        <h2>Your Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.name}</td>
                <td>{task.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeHome;
