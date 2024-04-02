/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./empstyle.css";

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
            const status =
              localStorage.getItem(`task_status_${task.id}`) || "Pending";
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

        processResponse(
          employeeResponse,
          setEmployees,
          "Error fetching employees:"
        );
        processResponse(
          categoryResponse,
          setCategories,
          "Error fetching categories:"
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskClick = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, showDropdown: true } : task
    );
    setTasks(updatedTasks);
  };

  const handleStatusChange = (taskId, status) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status, showDropdown: false } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`task_status_${taskId}`, status);
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Pending":
        return "pending";
      case "In Progress":
        return "in-progress";
      case "Completed":
        return "completed";
      case "Overdue":
        return "overdue";
      default:
        return "";
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  return (
    <div>
      <h2>Your Tasks</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th></th>
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
                <td>
                  <input
                    type="checkbox"
                    checked={task.selected}
                    onChange={() => handleTaskClick(task.id)}
                  />
                </td>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{formatDateTime(task.deadline)}</td>
                <td>{employees[task.employee_id]}</td>
                <td>{categories[task.category_id]}</td>
                <td className="status-cell">
                  <div
                    className={`status-circle ${getStatusColorClass(
                      task.status
                    )}`}
                    onClick={() => handleTaskClick(task.id)}
                  ></div>
                  {task.showDropdown && (
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      {task.isOverdue && <option value="Overdue">Overdue</option>}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeTasks;

               
