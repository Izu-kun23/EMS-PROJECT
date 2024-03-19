import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css'; // Ensure this CSS file exists and contains the styles for your component

const Users = () => {
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    const fetchAdminRecords = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/admin_records');
        if (response.data.Status) {
          setAdmin(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      } catch (error) {
        console.error('Failed to fetch admin records:', error);
        alert('An error occurred while fetching admin records.');
      }
    };

    fetchAdminRecords();
  }, []);

  const handleEdit = (email) => {
    console.log('Edit:', email);
    // Implement the edit functionality, possibly by setting the current admin to be edited in the state
    // and opening a modal or redirecting to an edit page with the admin's details.
  };

  const handleDelete = (email) => {
    console.log('Delete:', email);
    // Implement the delete functionality, possibly by sending a DELETE request to your backend.
    // Don't forget to update your state after deletion to remove the admin from the list.
  };

  return (
    <div className="userlist-container">
      <div className="userlist-header">
        <h1>All Users</h1>
        <Link to="/dashboard/add_user" className="btn btn-primary">
          Add User
        </Link>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admin.map((admin) => (
            <tr>
              <td>{admin.email}</td>
              <td>{admin.password}</td>
              <td>
                <button
                  onClick={() => handleEdit(admin.email)}
                  className="btn btn-info btn-sm me-2"
                  
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(admin.email)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;

