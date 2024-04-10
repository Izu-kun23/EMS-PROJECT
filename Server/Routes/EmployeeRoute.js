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
    const { employee_id, date, startTime, endTime, hoursWorked, notes } = req.body;
  
    // Validation for the required fields
    if (!employee_id || !date || !startTime || !endTime || !hoursWorked) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    // Insert the timesheet data into the database
    const sql = "INSERT INTO timesheet (employee_id, date, start_time, end_time, hours_worked, notes) VALUES (?, ?, ?, ?, ?, ?)";
    con.query(sql, [employee_id, date, startTime, endTime, hoursWorked, notes], (err, result) => {
      if (err) {
        console.error('Error adding timesheet:', err);
        return res.status(500).json({ success: false, message: 'Error adding timesheet', error: err.message });
      } else {
        return res.json({ success: true, message: 'Timesheet added successfully', id: result.insertId });
      }
    });
  });
  
  router.put('/employee/update_task_status/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
  
    try {
      const task = await TaskModel.findById(taskId); // Assuming TaskModel is your database model
      if (!task) {
        return res.status(404).send({ Status: false, Error: 'Task not found' });
      }
      task.status = status;
      await task.save();
      res.send({ Status: true, Message: 'Task status updated successfully' });
    } catch (error) {
      res.status(500).send({ Status: false, Error: error.message });
    }
  });
  
  router.get('/employee_timesheet/:id', (req, res) => {
    const employee_id = req.params.id;
    const sql = "SELECT * FROM timesheet WHERE employee_id = ?";
    con.query(sql, [employee_id], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: "Query Error" });
        } else {
            return res.json({ Status: true, Result: result });
        }
    });
});


  
// Task Count Endpoint
router.get('/task_count/:id', (req, res) => {
  const sql = "select count(id) as tasks from tasks";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/timesheet_count/:id', (req, res) => {
  const sql = "select count(id) as timesheet from timesheet";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})
  

  

  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })
  
  export {router as EmployeeRouter}