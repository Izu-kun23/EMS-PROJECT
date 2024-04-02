import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css'; // Ensure this CSS file exists and contains the styles for your component

const Users = () => {
  const [admins, setAdmins] = useState([]); // Rename to 'admins' for clarity

  useEffect(() => {
    const fetchAdminRecords = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/admin_records');
        if (response.data.Status) {
          setAdmins(response.data.Result);
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
  const handleDelete = (id) => {
    axios.delete("http://localhost:3000/auth/delete_user/" +id)
    .then(result => {
      if(result.data.Status){
        window.location.reload()
      }else{
        alert(result.data.Error)
      }
    })
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
          {admins.map((admin) => (
            <tr key={admin.id}> {/* Add a key for React elements */}
              <td>{admin.email}</td>
              <td>{'••••••••'}</td> {/* Do not display passwords */}
              <td>
                <Link
                  to={`/dashboard/edit_user/${admin.id}`}
                  className="btn btn-info btn-sm me-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(admin.id)}
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
