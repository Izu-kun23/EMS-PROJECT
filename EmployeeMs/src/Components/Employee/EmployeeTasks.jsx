/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './empstyle.css';
import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState({});
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const id = localStorage.getItem("employee_id");
        const [
          tasksResponse,
          employeeResponse,
          categoryResponse,
        ] = await Promise.all([
          axios.get(`http://localhost:3000/employee/employee_tasks/${id}`),
          axios.get("http://localhost:3000/auth/employee"),
          axios.get("http://localhost:3000/auth/category"),
        ]);

        if (tasksResponse.data.Status) {
          const tasksWithDetails = tasksResponse.data.Result.map((task) => {
            const employee = employeeResponse.data.Result.find(
              (emp) => emp.id === task.employee_id
            );
            const category = categoryResponse.data.Result.find(
              (cat) => cat.id === task.category_id
            );
            const employeeName = employee ? employee.name : "N/A";
            const categoryName = category ? category.name : "N/A";
            const storedStatus = localStorage.getItem(`task_status_${task.id}`);
            const status = storedStatus || task.status; // Use stored status if available
            const isOverdue = new Date(task.deadline) < new Date();

            return {
              ...task,
              employee_name: employeeName,
              category_name: categoryName,
              selected: false,
              status,
              isOverdue,
              showDropdown: false,
            };
          });

          setTasks(tasksWithDetails);
        } else {
          console.error("Error fetching tasks:", tasksResponse.data.Error);
        }

        const processResponse = (response, setData, errorMessage) => {
          if (response.data.Status) {
            const dataMap = {};
            response.data.Result.forEach((item) => {
              dataMap[item.id] = item.name;
            });
            setData(dataMap);
          } else {
            console.error(errorMessage, response.data.Error);
          }
        };

        processResponse(employeeResponse, setEmployees, "Error fetching employees:");
        processResponse(categoryResponse, setCategories, "Error fetching categories:");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    // Update locally
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus, showDropdown: false } : task
    );
    setTasks(updatedTasks);

    // Store status in localStorage
    localStorage.setItem(`task_status_${taskId}`, newStatus);

    // Emit an event to notify other components about the status change
    eventEmitter.emit('taskStatusChange', { id: taskId, status: newStatus });

    // Send update to backend
    try {
      const response = await axios.put(`http://localhost:3000/employee/update_task_status/${taskId}`, { status: newStatus });
      if (!response.data.Status) {
        console.error("Failed to update task status:", response.data.Error);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div>
      <h2>Your Tasks</h2>
      {loading ? (
        <div>Loading...</div>
      ) : tasks.length > 0 ? (
        <table className="task-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Employee Name</th>
              <th>Category Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className={task.selected ? "selected" : ""}>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{new Date(task.deadline).toLocaleString()}</td>
                <td>{employees[task.employee_id]}</td>
                <td>{categories[task.category_id]}</td>
                <td className="status-cell">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    {task.isOverdue && <option value="Overdue">Overdue</option>}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No recent tasks.</p>
      )}
    </div>
  );
};

export default EmployeeTasks;
