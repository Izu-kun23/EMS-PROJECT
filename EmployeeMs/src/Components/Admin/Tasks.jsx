/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import './style.css';
import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState({});
  const [categories, setCategories] = useState({});

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    // Subscribe to 'taskStatusChange' event
    const handleTaskStatusChange = ({ id, status }) => {
      // Update task status in the local state
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, status } : task
      );
      setTasks(updatedTasks);
      // Update local storage with updated tasks
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    eventEmitter.on('taskStatusChange', handleTaskStatusChange);

    return () => {
      clearInterval(interval); // Clear interval
      eventEmitter.removeListener('taskStatusChange', handleTaskStatusChange);
    };
  }, [tasks]); // Dependency added: 'tasks'

  useEffect(() => {
    // Retrieve tasks from local storage on component mount
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const fetchData = async () => {
    try {
      const [tasksResponse, employeeResponse, categoryResponse] = await Promise.all([
        axios.get('http://localhost:3000/auth/tasks'),
        axios.get('http://localhost:3000/auth/employee'),
        axios.get('http://localhost:3000/auth/category')
      ]);
  
      if (tasksResponse.data.Status) {
        const tasksWithNames = tasksResponse.data.Result.map(task => {
          const employee = employeeResponse.data.Result.find(emp => emp.id === task.employee_id);
          const category = categoryResponse.data.Result.find(cat => cat.id === task.category_id);
  
          const employeeName = employee ? employee.name : 'N/A';
          const categoryName = category ? category.name : 'N/A';
  
          return {
            ...task,
            employee_name: employeeName,
            category_name: categoryName,
            selected: false,
            status: task.status,
            isOverdue: task.isOverdue,
            showDropdown: false,
          };
        });
  
        setTasks(tasksWithNames);
        // Update local storage with fetched tasks
        localStorage.setItem('tasks', JSON.stringify(tasksWithNames));
      } else {
        console.error('Error fetching tasks:', tasksResponse.data.Error);
      }
  
      if (employeeResponse.data.Status) {
        const employeeData = {};
        employeeResponse.data.Result.forEach(employee => {
          employeeData[employee.id] = employee.name;
        });
        setEmployees(employeeData); // Update employees state
      } else {
        alert(employeeResponse.data.Error);
      }
  
      if (categoryResponse.data.Status) {
        const categoryData = {};
        categoryResponse.data.Result.forEach(category => {
          categoryData[category.id] = category.name;
        });
        setCategories(categoryData); // Update categories state
      } else {
        alert(categoryResponse.data.Error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleTaskClick = taskId => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const handleDeleteTask = async taskId => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');

    if (confirmDelete) {
      try {
        // Make a request to your server's delete endpoint
        const response = await axios.delete(`http://localhost:3000/auth/delete_tasks/${taskId}`);

        if (response.data.Status) {
          // Remove the deleted task from the state
          const updatedTasks = tasks.filter(task => task.id !== taskId);
          setTasks(updatedTasks);
          // Update local storage with updated tasks after deletion
          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        } else {
          console.error('Error deleting task:', response.data.Error);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

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
  

  const getStatusColorClass = status => {
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

  // Function to format the date string
  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h2>Task Page</h2>
      <div className="notes-app-layout">
        {tasks.map(task => (
          <div key={task.id} className={`note-card ${task.selected ? 'selected' : ''}`}>
            <div className="kebab-menu" onClick={() => handleTaskClick(task.id)}>
              <FaTrash onClick={() => handleDeleteTask(task.id)} />
            </div>
            <p><strong>Name:</strong> {task.name}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Deadline:</strong> {formatDate(task.deadline)}</p>
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
