/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // Import CSS file for styling

const AddTask = () => {
  const [task, setTask] = useState({
    name: '',
    description: '',
    deadline: '',
    employee_id: '',
    category_id: '',
  });
  const [category, setCategory] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchCategory();
    fetchEmployee();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/category');
      if (response.data.Status) {
        setCategory(response.data.Result);
      } else {
        console.error(response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/employee');
      if (response.data.Status) {
        setEmployee(response.data.Result);
      } else {
        console.error(response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/add_task', task);
      if (response.data.Status) {
        console.log('Task added successfully!');
        // Reset form fields after successful submission
        setTask({
          name: '',
          description: '',
          deadline: '',
          employee_id: '',
          category_id: '',
        });
        // Set success notification
        setNotification({ type: 'success', message: 'Task has been successfully assigned' });
        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      } else {
        console.error(response.data.Error);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  return (
    <div>
      <h2>Add Task</h2>
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={handleNotificationClose}>X</button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={task.name} onChange={(e) => setTask({ ...task, name: e.target.value })} />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })}></textarea>
        </div>
        <div>
          <label>Deadline:</label>
          <input type="date" value={task.deadline} onChange={(e) => setTask({ ...task, deadline: e.target.value })} />
        </div>
        <div>
          <label>Employee:</label>
          <select value={task.employee_id} onChange={(e) => setTask({ ...task, employee_id: e.target.value })}>
            <option value="">Select Employee</option>
            {employee.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Category:</label>
          <select value={task.category_id} onChange={(e) => setTask({ ...task, category_id: e.target.value })}>
            <option value="">Select Category</option>
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;
