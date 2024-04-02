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
  
  
  
  router.post('/employee_add_timesheet/:id', async (req, res) => {
    const employeeId = req.params.id;
    const { date, startTime, endTime, hoursWorked, notes } = req.body;
  
    try {
      // Assuming you have a table named "timesheets" in your database
      const result = await db.query(
        'INSERT INTO timesheets (employee_id, date, start_time, end_time, hours_worked, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [employeeId, date, startTime, endTime, hoursWorked, notes]
      );
      
      res.json({ success: true, message: 'Timesheet added successfully' });
    } catch (error) {
      console.error('Error adding timesheet:', error);
      res.status(500).json({ success: false, message: 'Error adding timesheet' });
    }
  });
  

  router.get('/employee_timesheets/:id', (req, res) => {
    const employeeId = req.params.id;
    const sql = "SELECT * FROM timesheets WHERE employee_id = ?";
    con.query(sql, [employeeId], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: "Query Error" });
        } else {
            return res.json({ Status: true, Result: result });
        }
    });
});

  

  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })
  
  export {router as EmployeeRouter}