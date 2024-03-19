import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [admin, setAdmin] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Directly send the admin object as JSON
    axios.post('http://localhost:3000/auth/add_user', admin)
      .then(result => {
        if(result.data.Status){
          navigate('/dashboard/users'); // Redirect to the users list page
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred while adding the user.');
      });
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add User</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword4" className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword4"
              placeholder="Enter Password"
              onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Add User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
