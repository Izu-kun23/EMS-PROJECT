/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEmployeeTimesheet = () => {
  // Initialize state for form inputs and employee list
  const [timesheetData, setTimesheetData] = useState({
    employeeId: '',
    date: '',
    startTime: '',
    endTime: '',
    hoursWorked: '',
    notes: '',
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingTimesheet, setAddingTimesheet] = useState(false); // State to track timesheet addition

  // Fetch list of employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/employee');
        if (response.data.Status) {
          setEmployees(response.data.Result);
        } else {
          console.error('Error fetching employees:', response.data.Error);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [addingTimesheet]); // Update employee list when addingTimesheet state changes

  // Function to update state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimesheetData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post('http://localhost:3000/employee/employee_add_timesheet', timesheetData);
      alert(response.data.message); // Show success message
      setTimesheetData({ employeeId: '', date: '', startTime: '', endTime: '', hoursWorked: '', notes: '' }); // Reset form
      setAddingTimesheet(prevState => !prevState); // Toggle addingTimesheet state to trigger useEffect
    } catch (error) {
      console.error('Error adding timesheet:', error);
      alert(error.response.data.message); // Show error message from backend
    }
  };

  return (
    <div>
      <h1>Add Employee Timesheet</h1>
      {loading ? (
        <div>Loading employees...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Employee:</label>
            <select
              name="employeeId"
              value={timesheetData.employeeId}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={timesheetData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={timesheetData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              name="endTime"
              value={timesheetData.endTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Hours Worked:</label>
            <input
              type="number"
              name="hoursWorked"
              value={timesheetData.hoursWorked}
              onChange={handleChange}
              required
              step="0.01"
            />
          </div>
          <div>
            <label>Notes:</label>
            <textarea
              name="notes"
              value={timesheetData.notes}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit Timesheet</button>
        </form>
      )}
    </div>
  );
};

export default AddEmployeeTimesheet;
