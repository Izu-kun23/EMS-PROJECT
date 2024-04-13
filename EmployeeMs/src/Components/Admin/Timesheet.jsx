/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa"; // Import icons from FontAwesome
import './style.css'; // Import CSS for styling

const Timesheet = () => {
  // State variables for timesheets, loading status, and archived toggle
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  // Fetch timesheets data from the server
  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const id = localStorage.getItem('employee_id');
        const [timesheetsResponse, employeeResponse] = await Promise.all([
          axios.get(`http://localhost:3000/auth/timesheet`),
          axios.get('http://localhost:3000/auth/employee')
        ]);

        if (timesheetsResponse.data.Status) {
          const timesheetsData = timesheetsResponse.data.Result;
          const employeesData = employeeResponse.data.Result;

          const timesheetsWithNames = timesheetsData.map(timesheet => {
            const employee = employeesData.find(emp => emp.id === timesheet.employee_id);
            const employeeName = employee ? employee.name : 'N/A';

            // Format date
            const formattedDate = new Date(timesheet.date).toLocaleDateString();

            return {
              ...timesheet,
              employee_name: employeeName,
              date: formattedDate, // Update date format
              selected: false,
            };
          });

          setTimesheets(timesheetsWithNames);
        } else {
          console.error('Error fetching timesheets:', timesheetsResponse.data.Error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheets();
  }, []);

  // Function to toggle showing archived timesheets
  const toggleShowArchived = () => {
    setShowArchived(!showArchived);
  };

  // Function to handle deletion of a timesheet
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/auth/delete_timesheet/${id}`);
      if (response.data.Status) {
        // Filter out the deleted timesheet from the state
        const updatedTimesheets = timesheets.filter(timesheet => timesheet.id !== id);
        setTimesheets(updatedTimesheets);
      } else {
        console.error('Error deleting timesheet:', response.data.Error);
      }
    } catch (error) {
      console.error('Error deleting timesheet:', error);
    }
  };

  // Render loading state if data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render message if no timesheets are available
  if (timesheets.length === 0) {
    return <div>No timesheets available.</div>;
  }

  // Render timesheets data
  return (
    <div className="timesheet-container">
      <h1>Employee Timesheets</h1>
      <button onClick={toggleShowArchived}>
        {showArchived ? 'Hide Archived' : 'Show Archived'}
      </button>
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
                  {/* Delete button */}
                  <FaTrashAlt className="icon delete-icon" onClick={() => handleDelete(timesheet.id)} />

                  {/* Edit button */}
                  <FaEdit className="icon edit-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timesheet;
