/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DatePicker, Table, Spin } from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;

const EmployeePay = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for payslips
  const mockPayslips = [
    {
      key: '1',
      date: '2024-04-01',
      amount: '2500.00',
      details: 'Salary for March',
      deductions: '200.00',
      netPay: '2300.00',
    },
    {
      key: '2',
      date: '2024-05-01',
      amount: '2500.00',
      details: 'Salary for April',
      deductions: '200.00',
      netPay: '2300.00',
    },
    {
      key: '3',
      date: '2024-06-01',
      amount: '2600.00',
      details: 'Salary for May - Bonus included',
      deductions: '210.00',
      netPay: '2390.00',
    },
    // ... more payslips
  ];

  useEffect(() => {
    // Replace with actual data load function in production
    setLoading(true);
    setTimeout(() => {
      setPayslips(mockPayslips); // Use the mock data
      setLoading(false);
    }, 1000); // Simulate a network request delay
  }, []);

  const loadPayslips = async (dates) => {
    // Replace this with actual data loading logic in production
  };

  const handleDateChange = (dates) => {
    // Replace this with actual date range filtering logic in production
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
    // Optionally, you can add more columns based on your mock data
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Deductions',
      dataIndex: 'deductions',
      key: 'deductions',
    },
    {
      title: 'Net Pay',
      dataIndex: 'netPay',
      key: 'netPay',
    },
  ];

  return (
    <div>
      <h1>Your Payslips</h1>
      <RangePicker onChange={handleDateChange} />
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={payslips} rowKey="key" />
      </Spin>
    </div>
  );
};

export default EmployeePay;
