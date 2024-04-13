/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, Typography, Avatar, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [employee, setEmployee] = useState({});
  const [category, setCategory] = useState('');
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const employeeResponse = await axios.get(`http://localhost:3000/employee/detail/${id}`);
        const employeeData = employeeResponse.data[0];
        setEmployee(employeeData);
        setLoading(false);

        const categoriesResponse = await axios.get('http://localhost:3000/auth/category');
        if (categoriesResponse.data.Status) {
          const categories = categoriesResponse.data.Result;
          const employeeCategory = categories.find(cat => cat.id === employeeData.category_id);
          setCategory(employeeCategory ? employeeCategory.name : 'N/A');
        } else {
          console.error('Error fetching categories:', categoriesResponse.data.Error);
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3000/employee/logout');
      if (response.data.Status) {
        localStorage.removeItem("valid");
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div>
          {employee.image ? ( // Check if employee image exists
            <Avatar size={96} src={`http://localhost:3000/Images/${employee.image}`} className="profile-avatar" />
          ) : (
            <Avatar size={96} icon={<UserOutlined />} className="profile-avatar" />
          )}
          <Title level={3} className="profile-name">{employee.name}</Title>
          <Text type="secondary" className="profile-role">{employee.category}</Text>
          <Divider className="profile-divider" />
          <div className="profile-info">
            <div>
              <Text strong>Employee ID:</Text>
              <Text>{employee.id}</Text>
            </div>
            <div>
              <Text strong>Email:</Text>
              <Text>{employee.email}</Text>
            </div>
            <div>
              <Text strong>Department:</Text>
              <Text>{category}</Text>
            </div>
          </div>
        </div>
        <div>
          <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
