/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const AddAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeIn, setSelectedTimeIn] = useState(new Date());
  const [selectedTimeOut, setSelectedTimeOut] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/employee');
      if (response.data.Status) {
        const employeeList = response.data.Result;
        setEmployees(employeeList);
        const initialStatus = {};
        employeeList.forEach((employee) => {
          initialStatus[employee.id] = {
            status: 'present',
            timeIn: null,
            timeOut: null,
          };
        });
        setAttendanceStatus(initialStatus);
        if (employeeList.length > 0) {
          setSelectedEmployee(employeeList[0].id);
        }
      } else {
        console.error(response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { selectedEmployee, selectedDate, selectedTimeIn, selectedTimeOut, notes } = attendanceStatus[selectedEmployee];
      const response = await axios.post('http://localhost:3000/auth/add_attendance', {
        employee_id: selectedEmployee,
        date: selectedDate,
        status: 'present', // Assuming status is always present when adding attendance
        time_in: selectedTimeIn,
        time_out: selectedTimeOut,
        notes: notes,
      });
      if (response.data.status) {
        console.log('Attendance record added successfully!');
        setSelectedEmployee('');
        setSelectedDate(new Date());
        setNotes('');
        const updatedStatus = { ...attendanceStatus };
        updatedStatus[selectedEmployee] = {
          status: 'present',
          timeIn: null,
          timeOut: null,
        };
        setAttendanceStatus(updatedStatus);
        navigate('/dashboard/attendance');
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding attendance record:', error);
    }
  };

  const handleStatusChange = (employeeId) => {
    const updatedStatus = { ...attendanceStatus };
    updatedStatus[employeeId] = {
      ...updatedStatus[employeeId],
      status: updatedStatus[employeeId].status === 'present' ? 'absent' : 'present',
    };
    setAttendanceStatus(updatedStatus);
  };

  return (
    <div className="add-attendance-container">
      <Link to="/dashboard/attendance" className="view-attendance-button">
        View Attendance
      </Link>
      <h2>Add Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Employee:</label>
          <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
        </div>
        <div className="form-group">
          <label>Status:</label>
          {attendanceStatus[selectedEmployee] && (
            <button
              type="button"
              onClick={() => handleStatusChange(selectedEmployee)}
            >
              {attendanceStatus[selectedEmployee].status === 'present'
                ? 'Mark Absent'
                : 'Mark Present'}
            </button>
          )}
        </div>
        <div className="form-group">
          <label>Time In:</label>
          <DatePicker selected={selectedTimeIn} onChange={(time) => setSelectedTimeIn(time)} showTimeSelect showTimeSelectOnly timeIntervals={15} dateFormat="h:mm aa" />
        </div>
        <div className="form-group">
          <label>Time Out:</label>
          <DatePicker selected={selectedTimeOut} onChange={(time) => setSelectedTimeOut(time)} showTimeSelect showTimeSelectOnly timeIntervals={15} dateFormat="h:mm aa" />
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddAttendance;
