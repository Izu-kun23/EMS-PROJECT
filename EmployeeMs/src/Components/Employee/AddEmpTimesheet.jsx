/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddTimesheet = () => {
  const [timesheet, setTimesheet] = useState({
    date: "",
    startTime: "",
    endTime: "",
    hoursWorked: "",
    notes: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setTimesheet({ ...timesheet, [name]: value });

    // Calculate hours worked if both start and end time are provided
    if (name === "startTime" || name === "endTime") {
      const { startTime, endTime } = timesheet;

      if (startTime && endTime) {
        const start = new Date(`01/01/2000 ${startTime}`);
        const end = new Date(`01/01/2000 ${endTime}`);

        // Calculate time difference in milliseconds
        let diff = end.getTime() - start.getTime();

        // Convert milliseconds to hours
        diff = diff / (1000 * 60 * 60);

        // Round to two decimal places
        diff = Math.round(diff * 100) / 100;

        // Update hours worked in form data
        setTimesheet({ ...timesheet, hoursWorked: diff.toString() });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3000/employee/employee_add_timesheet/${id}`, timesheet)
      .then((response) => {
        if (response.data.Status) {
          setTimesheet({
            date: "",
            startTime: "",
            endTime: "",
            hoursWorked: "",
            notes: "",
          });
          // Handle success, maybe navigate to a different page
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded border shadow-lg w-50">
        <h3 className="text-center">Add Timesheet</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="inputDate" className="form-label">
                Date
              </label>
              <input
                type="date"
                className="form-control rounded"
                id="inputDate"
                value={timesheet.date}
                name="date"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputStartTime" className="form-label">
                Start Time
              </label>
              <input
                type="time"
                className="form-control rounded"
                id="inputStartTime"
                value={timesheet.startTime}
                name="startTime"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputEndTime" className="form-label">
                End Time
              </label>
              <input
                type="time"
                className="form-control rounded"
                id="inputEndTime"
                value={timesheet.endTime}
                name="endTime"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputHoursWorked" className="form-label">
                Hours Worked
              </label>
              <input
                type="text"
                className="form-control rounded"
                id="inputHoursWorked"
                value={timesheet.hoursWorked}
                name="hoursWorked"
                readOnly
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputNotes" className="form-label">
                Notes
              </label>
              <textarea
                className="form-control rounded"
                id="inputNotes"
                value={timesheet.notes}
                name="notes"
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">
                Add Timesheet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTimesheet;
