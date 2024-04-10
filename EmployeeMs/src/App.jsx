/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Admin/Login";
import Dashboard from "./Components/Admin/Dashboard";
import Home from "./Components/Admin/Home";
import Category from "./Components/Admin/Category";
import Employee from "./Components/Admin/Employee";
import AddCategory from "./Components/Admin/AddCategory";
import AddEmployee from "./Components/Admin/AddEmployee";
import EditEmployee from "./Components/Admin/EditEmployee";
import Start from "./Components/Admin/Start";
import EmployeeLogin from "./Components/Employee/EmployeeLogin";
import Tasks from "./Components/Admin/Tasks";
import Users from "./Components/Admin/Users";
import AddUser from "./Components/Admin/AddUser";
import AddTask from "./Components/Admin/AddTask";
import EditUser from "./Components/Admin/EditUser";
import Appointments from "./Components/Admin/Appointments";
import AddAppointment from "./Components/Admin/AddAppointments";
import EmployeeTasks from "./Components/Employee/EmployeeTasks";
import EmployeeHome from "./Components/Employee/EmployeeHome";
import EmployeeTimesheet from "./Components/Employee/EmployeeTimesheet";
import ProfilePage from "./Components/Employee/ProfilePage";
import EmployeePay from "./Components/Employee/EmployeePay";
import EmployeeDetail from "./Components/Employee/EmployeeDetail";
import EmployeeCalender from "./Components/Employee/EmployeeCalender";
import AddAttendance from "./Components/Admin/AddAttendance";
import Attendance from "./Components/Admin/Attendance";
import AddEmpTimesheet from "./Components/Employee/AddEmpTimesheet";
import TImesheet from "./Components/Admin/TImesheet";
import Payslips from "./Components/Admin/Payslips";

// PrivateRoute component to protect routes
const PrivateRoute = ({ element }) => {
  // Replace this with your actual authentication logic
  const isAuthenticated = true; // Example: Check if the user is authenticated

  return isAuthenticated ? element : <Navigate to="/adminlogin" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Start />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/employee_login" element={<EmployeeLogin />} />

        <Route path="/employee_detail/:id" element={<EmployeeDetail />}>
          <Route path="" element={<EmployeeHome />} />
          <Route
            path="employee_tasks/:id"
            element={<EmployeeTasks />}
          />
          <Route path="employee_timesheet/:id" element={<EmployeeTimesheet />} />
          <Route path="employee_calender/:id" element={<EmployeeCalender />} />
          <Route path="employee_pay/:id" element={<EmployeePay />} />
          <Route path="employee_add_timesheet/:id" element={<AddEmpTimesheet />} />
          <Route path="employee_timesheet/:id" element={<EmployeeTimesheet />} />
          <Route path="profile_page/:id" element={<ProfilePage />} />
        </Route>

        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        >
          <Route path="" element={<Home />} />
          <Route path="/dashboard/employee" element={<Employee />} />
          <Route path="/dashboard/category" element={<Category />} />
          <Route path="/dashboard/tasks" element={<Tasks />} />
          <Route path="/dashboard/users" element={<Users />} />
          <Route path="/dashboard/payslips" element={<Payslips />} />
          <Route path="/dashboard/add_category" element={<AddCategory />} />
          <Route path="/dashboard/add_employee" element={<AddEmployee />} />
          <Route
            path="/dashboard/edit_employee/:id"
            element={<EditEmployee />}
          />
          <Route path="/dashboard/add_user" element={<AddUser />} />
          <Route path="/dashboard/add_attendance" element={<AddAttendance />} />
          <Route path="/dashboard/timesheet" element={<TImesheet/>} />
          <Route path="/dashboard/edit_user/:id" element={<EditUser />} />
          <Route path="/dashboard/add_task" element={<AddTask />} />
          <Route
            path="/dashboard/add_appointments"
            element={<AddAppointment />}
          />
          <Route path="/dashboard/appointments" element={<Appointments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
