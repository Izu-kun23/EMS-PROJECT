/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaTrashAlt, FaPlus } from 'react-icons/fa'; // Import delete and add icons
import './EmployeeTimesheet.css'; // Import CSS for styling

const EmployeeTimesheet = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const employeeId = localStorage.getItem('employee_id');

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const [timesheetsResponse, employeeResponse] = await Promise.all([
          axios.get(`http://localhost:3000/employee/employee_timesheet/${employeeId}`),
          axios.get('http://localhost:3000/auth/employee')
        ]);

        if (timesheetsResponse.data.Status && employeeResponse.data.Status) {
          const timesheetsData = timesheetsResponse.data.Result;
          const employeesData = employeeResponse.data.Result;

          const timesheetsWithNames = timesheetsData.map(timesheet => {
            const employee = employeesData.find(emp => emp.id === timesheet.employee_id);
            const employeeName = employee ? employee.name : 'N/A';
            const formattedDate = new Date(timesheet.date).toLocaleDateString();

            return {
              ...timesheet,
              employee_name: employeeName,
              date: formattedDate,
              selected: false,
            };
          });

          setTimesheets(timesheetsWithNames);
        } else {
          console.error('Error fetching data:', timesheetsResponse.data.Error || employeeResponse.data.Error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheets();
  }, [employeeId]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/employee/delete_employee_timesheet/${id}`);
      if (response.data.Status) {
        const updatedTimesheets = timesheets.filter(timesheet => timesheet.id !== id);
        setTimesheets(updatedTimesheets);
      } else {
        console.error('Error deleting timesheet:', response.data.Error);
      }
    } catch (error) {
      console.error('Error deleting timesheet:', error);
    }
  };

  return (
    <div className="timesheet-container">
      <h1>Your Timesheets</h1>
      <Link to={`/employee_detail/${employeeId}/employee_add_timesheet/${employeeId}`} className="add-button">
        <FaPlus /> Add Timesheet
      </Link>
      {loading ? (
        <div>Loading...</div>
      ) : timesheets.length > 0 ? (
        <div className="table-container">
          <table className="timesheet-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Hours Worked</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map(timesheet => (
                <tr key={timesheet.id} className={timesheet.archived ? 'archived' : ''}>
                  <td>{timesheet.employee_name}</td>
                  <td>{timesheet.employee_id}</td>
                  <td>{timesheet.date}</td>
                  <td>{timesheet.start_time}</td>
                  <td>{timesheet.end_time}</td>
                  <td>{timesheet.hours_worked}</td>
                  <td>{timesheet.notes}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDelete(timesheet.id)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No timesheets available.</p>
      )}
    </div>
  );
};

export default EmployeeTimesheet;
