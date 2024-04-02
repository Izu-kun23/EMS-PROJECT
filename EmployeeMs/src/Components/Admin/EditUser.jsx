import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams(); // Assuming you're identifying users by 'id'
  const [admin, setAdmin] = useState({
    email: '',
    password: '', // Consider the security implications
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing user details
    axios.get(`http://localhost:3000/auth/users/${id}`)
      .then((result) => {
        if (result.data.Status) {
          // Make sure to use setAdmin here since that's the state update function you've defined
          setAdmin(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error('Failed to fetch user details:', err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make sure to send the admin data, not user, since your state variable is named admin
    axios.put(`http://localhost:3000/auth/edit_user/${id}`, admin)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/users"); // Redirect to the users list page
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error('An error occurred while updating the user:', err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="inputEmail" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              value={admin.email} // Ensure this is admin.email, not user.email
              onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputPassword" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              placeholder="Enter new password (leave blank to keep current)"
              onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Update User</button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
