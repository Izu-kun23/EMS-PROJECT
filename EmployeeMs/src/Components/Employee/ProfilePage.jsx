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
  const [category, setCategory] = useState(''); // Initialize category state
  const { id } = useParams(); // Use useParams to get the id from the URL
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/employee/detail/${id}`)
      .then(result => {
        setEmployee(result.data[0]);
        setLoading(false); // Set loading to false after data fetching
      })
      .catch(err => {
        console.log(err);
        setLoading(false); // Set loading to false in case of error
      });

    // Fetch categories inside the useEffect hook
    axios.get('http://localhost:3000/auth/category')
      .then(response => {
        if (response.data.Status) {
          // Categories fetched successfully
          const categories = response.data.Result;
          // Assuming the employee's category ID is stored in employee.category_id
          const employeeCategory = categories.find(cat => cat.id === employee.category_id);
          setCategory(employeeCategory ? employeeCategory.name : 'N/A');
        } else {
          // Error occurred while fetching categories
          console.error('Error fetching categories:', response.data.Error);
        }
      })
      .catch(error => {
        // Error occurred in making the request
        console.error('Error fetching categories:', error);
      });
  }, [id]); // Add id to the dependency array to trigger effect on id change

  const handleLogout = () => {
    axios.get('http://localhost:3000/employee/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div>
          <Avatar size={96} icon={<UserOutlined />} src={employee.image} className="profile-avatar" />
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
              <Text>{category}</Text> {/* Display category name */}
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
