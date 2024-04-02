// File path: src/components/Calendar.js

import React, { useState } from 'react';
import './style.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Mock appointment data
  const appointments = [
    { date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3), title: 'Team Meeting' },
    { date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5), title: 'Project Deadline' },
    { date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15), title: 'Project Defense' },
    { date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15), title: 'Code Review' },
    { date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22), title: 'One-on-One Session' },
    // ...add more appointments here
  ];

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-us', { month: 'long', year: 'numeric' });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const dayOfWeek = (year, month, day) => {
    return new Date(year, month, day).getDay();
  };

  const days = [];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = dayOfWeek(year, month, 1);
  const numberOfDays = daysInMonth(year, month);

  // Fill in the blanks for the start of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`blank-${i}`} className="day blank"></div>);
  }

  // Generate days in the month with appointments
  for (let day = 1; day <= numberOfDays; day++) {
    const date = new Date(year, month, day);
    const dayAppointments = appointments.filter(appointment =>
      appointment.date.getDate() === day &&
      appointment.date.getMonth() === month &&
      appointment.date.getFullYear() === year
    );

    days.push(
      <div key={`day-${day}`} className={`day ${dayAppointments.length > 0 ? 'has-appointment' : ''}`}>
        <span className="date-number">{day}</span>
        <div className="appointments">
          {dayAppointments.map((appointment, index) => (
            <div key={index} className="appointment">
              {appointment.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={goToPreviousMonth}>&lt;</button>
        <span>{formatMonthYear(currentDate)}</span>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>
      <div className="week-days">
        {daysOfWeek.map((day) => (
          <div key={day} className="week-day">{day}</div>
        ))}
      </div>
      <div className="days-container">
        {days}
      </div>
    </div>
  );
};

export default Calendar;
