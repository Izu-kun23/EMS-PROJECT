/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

const Timesheet = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/employee/employee_timesheet")
      .then((response) => {
        if (response.data.status) {
          setTimesheets(response.data.results);
        } else {
          console.error("Error fetching timesheets:", response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching timesheets:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (timesheets.length === 0) {
    return <div>No timesheets available.</div>;
  }

  return (
    <div>
      <h1>Employee Timesheets</h1>
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
          {timesheets.map((timesheet) => {
            // Convert ISO date string to Date object and then to desired format
            const formattedDate = new Date(timesheet.date)
              .toISOString()
              .split("T")[0];

            return (
              <tr key={timesheet.id}>
                <td>{timesheet.name}</td>
                <td>{formattedDate}</td> {/* Updated to use formattedDate */}
                <td>{timesheet.start_time}</td>
                <td>{timesheet.end_time}</td>
                <td>{timesheet.hours_worked}</td>
                <td>{timesheet.notes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Timesheet;
