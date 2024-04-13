/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddPayslip = () => {
  const [payslipData, setPayslipData] = useState({
    employee_id: '',
    date: '',
    amount: '',
    details: '',
    deduction: '', // Changed from 'deductions' to 'deduction'
    netPay: '',
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/employee');
        if (response.data.Status) {
          setEmployees(response.data.Result);
        } else {
          setError('Failed to fetch employees. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayslipData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/auth/add_payslips', payslipData);
      if (response.data.Status) {
        alert('Payslip added successfully!');
        setPayslipData({
          employee_id: '',
          date: '',
          amount: '',
          details: '',
          deduction: '', // Changed from 'deductions' to 'deduction'
          netPay: '',
        });
      } else {
        setError('Failed to add payslip. Please try again.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error adding payslip:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Payslip</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <select
            name="employee_id"
            value={payslipData.employee_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={payslipData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={payslipData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Details:</label>
          <textarea
            name="details"
            value={payslipData.details}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Deduction:</label> 
          <input
            type="number"
            name="deduction" 
            value={payslipData.deduction}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Net Pay:</label>
          <input
            type="number"
            name="netPay"
            value={payslipData.netPay}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default AddPayslip;
