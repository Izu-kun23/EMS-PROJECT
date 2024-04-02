/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import './style.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState({});
  const [categories, setCategories] = useState({});

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup function to clear the interval
  }, []);

  const fetchData = async () => {
    try {
      const tasksResponse = await axios.get('http://localhost:3000/auth/tasks');
      const employeeResponse = await axios.get('http://localhost:3000/auth/employee');
      const categoryResponse = await axios.get('http://localhost:3000/auth/category');

      if (tasksResponse.data.Status) {
        const tasksWithNames = tasksResponse.data.Result.map((task) => {
          const employee = employeeResponse.data.Result.find((emp) => emp.id === task.employee_id);
          const category = categoryResponse.data.Result.find((cat) => cat.id === task.category_id);

          const employeeName = employee ? employee.name : 'N/A';
          const categoryName = category ? category.name : 'N/A';

          return {
            ...task,
            employee_name: employeeName,
            category_name: categoryName,
            selected: false,
          };
        });

        setTasks(tasksWithNames);
      } else {
        console.error('Error fetching tasks:', tasksResponse.data.Error);
      }

      if (employeeResponse.data.Status) {
        const employeeData = {};
        employeeResponse.data.Result.forEach((employee) => {
          employeeData[employee.id] = employee.name;
        });
        setEmployees(employeeData);
      } else {
        alert(employeeResponse.data.Error);
      }

      if (categoryResponse.data.Status) {
        const categoryData = {};
        categoryResponse.data.Result.forEach((category) => {
          categoryData[category.id] = category.name;
        });
        setCategories(categoryData);
      } else {
        alert(categoryResponse.data.Error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTaskClick = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const handleDeleteTask = async (taskId) => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');

    if (confirmDelete) {
      try {
        // Make a request to your server's delete endpoint
        const response = await axios.delete(`http://localhost:3000/auth/delete_tasks/${taskId}`);

        if (response.data.Status) {
          // Remove the deleted task from the state
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        } else {
          console.error('Error deleting task:', response.data.Error);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      // Update the task status on the server
      await axios.put(`http://localhost:3000/auth/tasks/${taskId}`, {
        status,
      });

      // Update the task status in the local state
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status, showDropdown: false } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'pending';
      case 'In Progress':
        return 'in-progress';
      case 'Completed':
        return 'completed';
      case 'Overdue':
        return 'overdue';
      default:
        return '';
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  return (
    <div>
      <h2>Task Page</h2>
      <div className="notes-app-layout">
        {tasks.map((task) => (
          <div key={task.id} className={`note-card ${task.selected ? 'selected' : ''}`}>
            <div className="kebab-menu" onClick={() => handleTaskClick(task.id)}>
              <FaTrash onClick={() => handleDeleteTask(task.id)} />
            </div>
            <p><strong>ID:</strong> {task.id}</p>
            <p><strong>Name:</strong> {task.name}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Deadline:</strong> {task.deadline}</p>
            <p><strong>Employee Name:</strong> {employees[task.employee_id]}</p>
            <p><strong>Category Name:</strong> {categories[task.category_id]}</p>
            <p><strong>Status:</strong> 
              <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
