/* eslint-disable no-unused-vars */
// AddEmployee.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    category_id: "",
    image: null,
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("password", employee.password);
    formData.append("address", employee.address);
    formData.append("salary", employee.salary);
    formData.append("image", employee.image);
    formData.append("category_id", employee.category_id);

    axios.post("http://localhost:3000/auth/add_employee", formData)
      .then((result) => {
        if (result.data.Status) {
          setEmployee({
            name: "",
            email: "",
            password: "",
            salary: "",
            address: "",
            category_id: "",
            image: null,
          });
          navigate('/dashboard/employee');
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded border shadow-lg w-50">
        <h3 className="text-center">Add Employee</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="inputName" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control rounded"
                id="inputName"
                placeholder="Enter Name"
                onChange={(e) =>
                  setEmployee({ ...employee, name: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputEmail4" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control rounded"
                id="inputEmail4"
                placeholder="Enter Email"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, email: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputPassword4" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control rounded"
                id="inputPassword4"
                placeholder="Enter Password"
                onChange={(e) =>
                  setEmployee({ ...employee, password: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputSalary" className="form-label">
                Salary
              </label>
              <input
                type="text"
                className="form-control rounded"
                id="inputSalary"
                placeholder="Enter Salary"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, salary: e.target.value })
                }
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputAddress" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control rounded"
                id="inputAddress"
                placeholder="1234 Main St"
                autoComplete="off"
                onChange={(e) =>
                  setEmployee({ ...employee, address: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                name="category"
                id="category"
                className="form-select rounded"
                onChange={(e) =>
                  setEmployee({ ...employee, category_id: e.target.value })
                }
              >
                {category.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="inputGroupFile01">
                Select Image
              </label>
              <input
                type="file"
                className="form-control rounded"
                id="inputGroupFile01"
                name="image"
                onChange={(e) =>
                  setEmployee({ ...employee, image: e.target.files[0] })
                }
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">
                Add Employee
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
