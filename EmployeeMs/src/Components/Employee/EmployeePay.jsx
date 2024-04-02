/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DatePicker, Table, Spin } from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;

const EmployeePay = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial payslips when component mounts
    loadPayslips();
  }, []);

  const loadPayslips = async (dates) => {
    setLoading(true);
    try {
      // Fetch payslips data from API based on selected dates
      const response = await axios.get('http://localhost:3000/employee/pay', {
        params: {
          startDate: dates ? dates[0].format('YYYY-MM-DD') : null,
          endDate: dates ? dates[1].format('YYYY-MM-DD') : null,
        },
      });
      setPayslips(response.data);
    } catch (error) {
      console.error('Error fetching payslips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    loadPayslips(dates);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    // Add more columns as needed
  ];

  return (
    <div>
      <h1>Your Payslips</h1>
      <RangePicker onChange={handleDateChange} />
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={payslips} />
      </Spin>
    </div>
  );
};

export default EmployeePay;
