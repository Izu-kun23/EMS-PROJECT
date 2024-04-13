/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEmployeeTimesheet = () => {
  const [timesheetData, setTimesheetData] = useState({
    employeeId: '',
    date: '',
    startTime: '',
    endTime: '',
    hoursWorked: '',
    notes: '',
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/employee');
        if (response.data.Status) {
          setEmployees(response.data.Result);
          setLoading(false);
        } else {
          console.error('Error fetching employees:', response.data.Error);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimesheetData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/employee/employee_add_timesheet', timesheetData);
      alert(response.data.message);
      setTimesheetData({
        employeeId: '',
        date: '',
        startTime: '',
        endTime: '',
        hoursWorked: '',
        notes: '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error adding timesheet:', error);
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Employee Timesheet</h1>
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
        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Timesheet'}</button>
      </form>
    </div>
  );
};

export default AddEmployeeTimesheet;
