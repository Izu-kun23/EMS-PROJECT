/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

const AddTimesheet = () => {
  const [timesheet, setTimesheet] = useState({
    date: "",
    startTime: "",
    endTime: "",
    hoursWorked: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimesheet({ ...timesheet, [name]: value });
  
    if (name === 'startTime' || name === 'endTime') {
      if (timesheet.startTime && timesheet.endTime) {
        const calculatedHours = calculateHoursWorked();
        setTimesheet(prevTimesheet => ({
          ...prevTimesheet,
          hoursWorked: calculatedHours > 0 ? calculatedHours.toString() : ""
        }));
      }
    }
  };
  

  const calculateHoursWorked = () => {
    const start = new Date(`01/01/2000 ${timesheet.startTime}`);
    const end = new Date(`01/01/2000 ${timesheet.endTime}`);
    let diff = end - start;

    // Convert milliseconds to hours and round to two decimal places
    return diff > 0 ? Math.round((diff / (1000 * 60 * 60)) * 100) / 100 : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const hoursWorked = calculateHoursWorked();
    if (hoursWorked <= 0) {
      alert("End time must be after start time.");
      return;
    }

    const formData = { 
      date: timesheet.date, 
      startTime: timesheet.startTime, 
      endTime: timesheet.endTime, 
      hoursWorked, 
      notes: timesheet.notes 
    };
  
    axios.post(`http://localhost:3000/employee/employee_add_timesheet`, formData)
      .then((response) => {
        if (response.data.success) {
          alert("Timesheet added successfully");
          setTimesheet({
            date: "",
            startTime: "",
            endTime: "",
            hoursWorked: "",
            notes: "",
          });
        } else {
          alert("Failed to add timesheet");
        }
      })
      .catch((error) => {
        console.error("Error adding timesheet:", error);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div>
      <h1>Add Timesheet</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={timesheet.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="time"
            name="startTime"
            value={timesheet.startTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="time"
            name="endTime"
            value={timesheet.endTime}
            onChange={handleChange}
          />
        </div>
        <div>
  <label>Hours Worked:</label>
  <input
    type="text"
    name="hoursWorked"
    value={timesheet.hoursWorked}
    onChange={handleChange}
  />
</div>

        <div>
          <label>Notes:</label>
          <textarea
            name="notes"
            value={timesheet.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddTimesheet;
