import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Home from "./Components/Home";
import Category from "./Components/Category";
import Employee from "./Components/Employee";
import Profile from "./Components/Profile";
import AddCategory from "./Components/AddCategory";
import AddEmployee from "./Components/AddEmployee";
import EditEmployee from "./Components/EditEmployee";
import Start from "./Components/Start";
import EmployeeLogin from "./Components/EmployeeLogin";
import EmployeeDetail from "./Components/EmployeeDetail";

// PrivateRoute component to protect routes
const PrivateRoute = ({ element }) => {
  // Add your authentication logic here
  const isAuthenticated = /* your authentication logic */ true;

  return isAuthenticated ? element : <Navigate to="/adminlogin" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/employee_login" element={<EmployeeLogin />} />
        <Route path="/employee_detail/:id" element={<EmployeeDetail />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        >
          <Route path="" element={<Home />} />
          <Route path="/dashboard/employee" element={<Employee />} />
          <Route path="/dashboard/category" element={<Category />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route
            path="/dashboard/add_category"
            element={<AddCategory />}
          ></Route>
          <Route
            path="/dashboard/add_employee"
            element={<AddEmployee />}
          ></Route>
          <Route
            path="/dashboard/edit_employee/:id"
            element={<EditEmployee />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


// import React from 'react'
// import Login from './Login'
// import {BrowserRouter, Routes, Route} from 'react-router-dom'
// import Dashboard from './Dashboard'
// import Employee from './Employee'
// import Profile from './Profile'
// import Home from './Home'
// import './App.css'
// import AddEmployee from './AddEmployee'
// import EditEmployee from './EditEmployee'
// import Start from './Start'
// import EmployeeDetail from './EmployeeDetail'
// import EmployeeLogin from './EmployeeLogin'

// <BrowserRouter>
// <Routes>
//   <Route path='/' element={<Dashboard />}>
//     <Route path='' element={<Home />}></Route>
//     <Route path='/employee' element={<Employee />}></Route>
//     <Route path='/profile' element={<Profile />}></Route>
//     <Route path='/create' element={<AddEmployee />}></Route>
//     <Route path='/employeeEdit/:id' element={<EditEmployee />}></Route>
//   </Route>
//   <Route path='/login' element={<Login />}></Route>
//   <Route path='/start' element={<Start />}></Route>
//   <Route path='/employeeLogin' element={<EmployeeLogin />}></Route>
//   <Route path='/employeedetail/:id' element={<EmployeeDetail />}></Route>
// </Routes>
// </BrowserRouter>
