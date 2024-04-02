/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EmployeePDF from './EmployeePDF';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employees and categories when the component mounts
    axios
      .get('http://localhost:3000/auth/employee')
      .then((employeeResult) => {
        if (employeeResult.data.Status) {
          setEmployees(employeeResult.data.Result);
          // Fetch all categories
          axios
            .get('http://localhost:3000/auth/category')
            .then((categoryResult) => {
              if (categoryResult.data.Status) {
                const categoryData = {};
                categoryResult.data.Result.forEach((category) => {
                  categoryData[category.id] = category.name;
                });
                setCategories(categoryData);
              } else {
                alert(categoryResult.data.Error);
              }
            })
            .catch((error) => console.error(error));
        } else {
          alert(employeeResult.data.Error);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/auth/delete_employee/${id}`)
      .then((result) => {
        if (result.data.Status) {
          // Update the state after successful deletion
          setEmployees((prevEmployees) =>
            prevEmployees.filter((employee) => employee.id !== id)
          );
          alert('Employee deleted successfully');
        } else {
          alert(result.data.Error);
        }
      })
      .catch((error) => console.error(error));
  };

  const handleOpenPDF = (employee) => {
    const blob = new Blob([<EmployeePDF employee={employee} />], {
      type: 'application/pdf',
    });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="employee-list-container">
      <div className="employee-list-header">
        <h3>Employee List</h3>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for employee..."
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
      </div>
      <div className="employee-grid-layout">
        {employees.map((employee) => (
          <div key={employee.id} className="employee-card">
            <img
              src={`http://localhost:3000/Images/${employee.image}`}
              alt={employee.name}
              className="employee-image"
            />
            <div className="employee-details">
              <h5>{employee.name}</h5>
              <p>{employee.email}</p>
              <p>Salary: ${employee.salary}</p>
              <p>Category: {categories[employee.category_id]}</p>
            </div>
            <div className="employee-actions">
              <Link
                to={`/dashboard/edit_employee/${employee.id}`}
                className="btn btn-primary btn-sm me-2"
              >
                <FaEdit />
              </Link>
              <button
                onClick={() => handleDelete(employee.id)}
                className="btn btn-danger btn-sm"
              >
                <FaTrash />
              </button>
              <button
                onClick={() => handleOpenPDF(employee)}
                className="btn btn-secondary btn-sm ms-2"
              >
                Open PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employee;
