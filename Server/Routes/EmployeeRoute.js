import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const router = express.Router()

router.post("/employee_login", (req, res) => {
  const sql = "SELECT * from employee Where email = ?";
  con.query(sql, [req.body.email], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
          bcrypt.compare(req.body.password, result[0].password, (err, response) => {
              if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
              if(response) {
                  const email = result[0].email;
                  const token = jwt.sign(
                      { role: "employee", email: email, id: result[0].id },
                      "jwt_secret_key",
                      { expiresIn: "1d" }
                  );
                  res.cookie('token', token)
                  return res.json({ loginStatus: true, id: result[0].id });
              } else {
                  return res.json({ loginStatus: false, Error: "Wrong Password" });
              }
          });
      } else {
          return res.json({ loginStatus: false, Error: "Invalid email or password" });
      }
  });
});


  router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?"
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false});
        return res.json(result)
    })
  })

  // Route to handle task creation
  router.get('/employee_tasks/:id', (req, res) => {
    const employeeId = req.params.id;
    const sql = "SELECT * FROM tasks WHERE employee_id = ?";
    con.query(sql, [employeeId], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: "Query Error" });
        } else {
            return res.json({ Status: true, Result: result });
        }
    });
});

router.get('/profile/:id', (req, res) => {
    const employeeId = req.user.id; // Assuming you have user authentication middleware and it sets the user ID in req.user
    const sql = "SELECT * FROM employee WHERE id = ?";
    db.query(sql, [employeeId], (err, result) => {
      if (err) {
        console.error('Error fetching employee profile:', err);
        return res.json({ Status: false, Error: "Internal server error" });
      }
      if (result.length === 0) {
        return res.json({ Status: false, Error: "Employee not found" });
      }
      return res.json({ Status: true, Result: result[0] });
    });
  });
  
  
  router.post('/employee_add_timesheet', (req, res) => {
    const { date, startTime, endTime, hoursWorked, notes } = req.body;
  
    // Insert the timesheet data into the database
    const sql = "INSERT INTO timesheet (date, start_time, end_time, hours_worked, notes) VALUES (?, ?, ?, ?, ?)";
    con.query(sql, [date, startTime, endTime, hoursWorked, notes], (err, result) => {
      if (err) {
        console.error('Error adding timesheet:', err);
        return res.status(500).json({ success: false, message: 'Error adding timesheet' });
      } else {
        return res.json({ success: true, message: 'Timesheet added successfully', id: result.insertId });
      }
    });
  });
  
  




  router.get('/employee_timesheet', (req, res) => {
    // SQL query to select all entries from the timesheet table
    const sql = "SELECT * FROM timesheet";
    con.query(sql, (err, results) => {
      if (err) {
        console.error('Error accessing database', err);
        return res.status(500).json({ status: false, error: "Query Error" });
      } else {
        return res.json({ status: true, results });
      }
    });
  });
  
  
  

  

  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })
  
  export {router as EmployeeRouter}