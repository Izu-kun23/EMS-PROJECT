/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect } from "react";

const EmployeeTimesheet = () => {
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/employee/employee_timesheet`)
      .then((response) => {
        console.log("Response data:", response.data); // Debugging line
        if (response.data.status) {
          setTimesheets(response.data.results);
        } else {
          console.error("Error fetching timesheets:", response.data.error); // Adjusted to camelCase
        }
      })
      .catch((error) => {
        console.error("Error fetching timesheets:", error);
      });
  }, []); // Removed the id dependency array since it's no longer needed

  console.log("Timesheets state:", timesheets); // Debugging line

  return (
    <div>
      <h1>Employee Timesheets</h1>
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
          {timesheets.length > 0 ? (
            timesheets.map((timesheet) => (
              <tr key={timesheet.id}>
                <td>{timesheet.date}</td>
                <td>{timesheet.start_time}</td>
                <td>{timesheet.end_time}</td>
                <td>{timesheet.hours_worked}</td>
                <td>{timesheet.notes}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No timesheets available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTimesheet;
