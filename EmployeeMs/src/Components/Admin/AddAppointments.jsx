// File path: src/components/AddAppointment.js

import React, { useState } from 'react';
import "./style.css";

const AddAppointment = ({ onAdd }) => {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');

  const onSubmit = (e) => {
    e.preventDefault(); // Prevent actual form submission

    if (!date || !title) {
      alert('Please add a date and title for the appointment');
      return;
    }

    onAdd({ date, title });

    // Clear the form
    setDate('');
    setTitle('');
  };

  return (
    <form className="add-appointment-form" onSubmit={onSubmit}>
      <div className="form-control">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Appointment Title"
        />
      </div>
      <input type="submit" value="Save Appointment" className="btn btn-save" />
    </form>
  );
};

export default AddAppointment;
