/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeTimesheetPage = ({ employeeId }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/employee/employee_timesheets/${employeeId}`);
        if (response.data.Status) {
          setTimesheets(response.data.Result);
        } else {
          console.error('Error fetching timesheets:', response.data.Error);
        }
      } catch (error) {
        console.error('Error fetching timesheets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheets();
  }, [employeeId]);

  return (
    <div>
      <h1>Employee Timesheet</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Hours Worked</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map(timesheet => (
              <tr key={timesheet.id}>
                <td>{timesheet.date}</td>
                <td>{timesheet.start_time}</td>
                <td>{timesheet.end_time}</td>
                <td>{timesheet.hours_worked}</td>
                <td>{timesheet.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeTimesheetPage;
