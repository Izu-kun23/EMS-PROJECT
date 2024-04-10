/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeTimesheet = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState({});

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const id = localStorage.getItem("employee_id"); // Retrieve the employee ID
        const response = await axios.get(`http://localhost:3000/employee/employee_timesheet/${id}`);

        if (response.data.Status) {
          setTimesheets(response.data.Result);

          // Extract unique employee IDs from timesheets
          const uniqueEmployeeIds = Array.from(new Set(response.data.Result.map(timesheet => timesheet.employee_id)));

          // Fetch employee names for each unique ID
          const employeeNames = await Promise.all(uniqueEmployeeIds.map(async id => {
            const employeeResponse = await axios.get(`http://localhost:3000/employee/${id}`);
            return { id, name: employeeResponse.data.name };
          }));

          // Store employee names in an object for easy access
          const employeeNameMap = {};
          employeeNames.forEach(employee => {
            employeeNameMap[employee.id] = employee.name;
          });

          setEmployees(employeeNameMap);
        } else {
          console.error("Error fetching timesheets:", response.data.Error);
        }
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheets();
  }, []);

  return (
    <div>
      <h1>Employee Timesheets</h1>
      {loading ? (
        <div>Loading...</div>
      ) : timesheets.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Hours Worked</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((timesheet) => (
              <tr key={timesheet.id}>
                <td>{employees[timesheet.employee_id]}</td>
                <td>{timesheet.date}</td>
                <td>{timesheet.start_time}</td>
                <td>{timesheet.end_time}</td>
                <td>{timesheet.hours_worked}</td>
                <td>{timesheet.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No timesheets available.</p>
      )}
    </div>
  );
};

export default EmployeeTimesheet;
