/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/attendance');
      if (response.data.Status) {
        setAttendance(response.data.Result);
      } else {
        console.error(response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  return (
    <div>
      <h2>Attendance</h2>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((attendance) => (
            <tr key={attendance.id}>
              <td>{attendance.employee_id}</td>
              <td>{attendance.date}</td>
              <td>{attendance.status}</td>
              <td>{attendance.time_in}</td>
              <td>{attendance.time_out}</td>
              <td>{attendance.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
