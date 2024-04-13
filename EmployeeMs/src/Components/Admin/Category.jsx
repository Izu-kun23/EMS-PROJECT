/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './style.css'; // Import CSS file for styling

const Category = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/auth/category")
      .then(result => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleEdit = (id) => {
    // Navigate to the edit page with the category
    navigate(`/dashboard/edit_category`);
  };

  const handleDelete = (id) => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`http://localhost:3000/auth/delete_category/${id}`)
        .then((result) => {
          if (result.data.Status) {
            // Remove the deleted category from the state
            setCategories((prevCategories) =>
              prevCategories.filter((category) => category.id !== id)
            );
          } else if (result.data.Error.includes("foreign key constraint")) {
            // Handle foreign key constraint error
            alert("Cannot delete category. There are associated records in other tables.");
          } else {
            // Handle other scenarios if needed
            alert(result.data.Error || "An error occurred while deleting the category.");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("An error occurred while deleting the category.");
        });
    }
  };

  return (
    <div className='category-container'>
      <div className='category-header'>
        <h3>CATEGORY LIST</h3>
      </div>
      <Link to="/dashboard/add_category" className='btn btn-success add-category-btn'>
        ADD CATEGORY
      </Link>
      <div className='category-table'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <button className='btn btn-primary edit-btn' onClick={() => handleEdit(category.id)}>
                    Edit
                  </button>
                  <button className='btn btn-danger delete-btn' onClick={() => handleDelete(category.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
