/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { DatePicker, Table, Spin, Button } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment'; // Import moment library

const { RangePicker } = DatePicker;

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const [payslipsResponse, employeesResponse] = await Promise.all([
        axios.get('http://localhost:3000/auth/payslips'),
        axios.get('http://localhost:3000/auth/employee'),
      ]);

      if (payslipsResponse.data.Status && employeesResponse.data.Status) {
        const payslipsData = payslipsResponse.data.Result;
        const employeesData = employeesResponse.data.Result;

        const modifiedPayslips = payslipsData.map((payslip, index) => {
          const employee = employeesData.find(emp => emp.id === payslip.employee_id);
          const formattedDate = moment(payslip.date).format('YYYY-MM-DD'); // Change the format here
          return {
            ...payslip,
            key: index, // Assign a unique key to each row
            employeeName: employee ? employee.name : 'Unknown', // Get employee name or set as 'Unknown' if not found
            date: formattedDate, // Assign the formatted date
          };
        });

        setPayslips(modifiedPayslips);
      } else {
        console.error('Failed to fetch payslips or employees');
      }
    } catch (error) {
      console.error('Error fetching payslips or employees:', error);
    }
    setLoading(false);
  };

  const handleDateChange = (dates) => {
    // Implement date range filtering logic if needed
  };

  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
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
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Deductions',
      dataIndex: 'deduction',
      key: 'deduction',
    },
    {
      title: 'Net Pay',
      dataIndex: 'net_pay',
      key: 'net_pay',
    },
  ];

  return (
    <div>
      <h1>Your Payslips</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <RangePicker onChange={handleDateChange} />
        </div>
        <div>
          <Button type="primary">
            <Link to="/dashboard/add_payslips">Add Payslip</Link>
          </Button>
        </div>
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={payslips} rowKey="key" />
      </Spin>
    </div>
  );
};

export default Payslips;
