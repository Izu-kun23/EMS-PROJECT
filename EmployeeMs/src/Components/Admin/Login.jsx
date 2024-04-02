/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import "./style.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import loginImage from './login-image.png'; // Import your image here

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/auth/adminlogin', values)
      .then(result => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          navigate('/dashboard');
        } else {
          setError(result.data.Error);
        }
      })
      .catch(err => {
        console.error(err);
        setError('An error occurred while logging in.');
      });
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
      <div className='p-3 rounded loginForm'>
        <img src="/Images/logopic.png" alt="Authenticator" className="login-image" />
        <div className='error-message'>
          {error && error}
        </div>
        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email:</strong></label>
            <input type="email" name='email' autoComplete='off' placeholder='Enter Email'
              onChange={(e) => setValues({ ...values, email: e.target.value })} className='form-control' />
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password:</strong></label>
            <input type="password" name='password' autoComplete='off' placeholder='Enter Password'
              onChange={(e) => setValues({ ...values, password: e.target.value })} className='form-control' />
          </div>
          <button className='btn btn-primary w-100'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
