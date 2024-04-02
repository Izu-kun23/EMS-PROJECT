/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './empstyle.css';

const EmployeeCalendar = () => {
  const [timesheets, setTimesheets] = useState([
    { date: '2024-03-01', details: 'Full Hours' },
    { date: '2024-03-05', details: 'Half Day' },
    { date: '2024-03-10', details: 'Full Hours' },
    // Add more timesheets as needed
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const daysInMonth = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay();

    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDays = lastDayOfMonth.getDate();

    for (let i = 0; i < startingDay; i++) {
      daysInMonth.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    for (let day = 1; day <= numDays; day++) {
      const date = new Date(year, month, day);
      const formattedDate = date.toISOString().split('T')[0];
      const timesheet = timesheets.find(item => item.date === formattedDate);
      let dayClass = 'unsubmitted-day';
      if (timesheet) {
        if (timesheet.details === 'Full Hours') {
          dayClass = 'full-hours-day';
        } else if (timesheet.details === 'Half Day') {
          dayClass = 'half-day';
        }
      }
      daysInMonth.push(
        <div key={formattedDate} className={`calendar-day ${dayClass}`}>
          {day}
        </div>
      );
    }

    return daysInMonth;
  };

  return (
    <div className="employee-calendar">
      <div className="calendar-navigation">
        <button onClick={goToPreviousMonth}>&#8592;</button>
        <div className="calendar-header">{getCurrentMonthName(currentDate)} {getCurrentYear(currentDate)}</div>
        <button onClick={goToNextMonth}>&#8594;</button>
      </div>
      <div className="calendar-grid">
        <div className="calendar-day-header">Sun</div>
        <div className="calendar-day-header">Mon</div>
        <div className="calendar-day-header">Tue</div>
        <div className="calendar-day-header">Wed</div>
        <div className="calendar-day-header">Thu</div>
        <div className="calendar-day-header">Fri</div>
        <div className="calendar-day-header">Sat</div>
        {renderCalendarDays()}
      </div>
    </div>
  );
};

const getCurrentMonthName = (date) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[date.getMonth()];
};

const getCurrentYear = (date) => {
  return date.getFullYear();
};

export default EmployeeCalendar;
