/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    password: '',
    salary: '',
    address: '',
    category_id: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/auth/category')
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert('Failed to fetch categories: ' + result.data.Error);
        }
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(employee).forEach(key => {
      formData.append(key, employee[key]);
    });
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    axios.post('http://localhost:3000/auth/add_employee', formData)
      .then(result => {
        if(result.data.Status) {
            navigate('/dashboard/employee');
        } else {
            alert('Failed to add employee: ' + result.data.Error);
        }
      })
      .catch(err => console.error('Error adding employee:', err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleInputChange}
            placeholder="Enter name"
          />
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
          <input
            type="password"
            name="password"
            value={employee.password}
            onChange={handleInputChange}
            placeholder="Enter password"
          />
          <input
            type="text"
            name="salary"
            value={employee.salary}
            onChange={handleInputChange}
            placeholder="Enter salary"
          />
          <input
            type="text"
            name="address"
            value={employee.address}
            onChange={handleInputChange}
            placeholder="Enter address"
          />
          <select
            name="category_id"
            value={employee.category_id}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input
            type="file"
            name="image"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button type="submit">Add Employee</button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
