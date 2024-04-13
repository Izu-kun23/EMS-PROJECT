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

router.delete('/employee_tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = "DELETE FROM tasks WHERE id = ?";
  con.query(sql, [taskId], (err, result) => {
      if (err) {
          return res.json({ Status: false, Error: "Query Error" });
      } else {
          return res.json({ Status: true, Message: "Task deleted successfully" });
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
    const { employeeId, date, startTime, endTime, hoursWorked, notes } = req.body;
  
    // Validation for the required fields
    if (!employeeId || !date || !startTime || !endTime || !hoursWorked) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    // Insert the timesheet data into the database
    const sql = "INSERT INTO timesheet (employee_id, date, start_time, end_time, hours_worked, notes) VALUES (?, ?, ?, ?, ?, ?)";
    con.query(sql, [employeeId, date, startTime, endTime, hoursWorked, notes], (err, result) => {
        if (err) {
            console.error('Error adding timesheet:', err);
            return res.status(500).json({ success: false, message: 'Error adding timesheet', error: err.message });
        } else {
            if (result.affectedRows === 1) {
                return res.json({ success: true, message: 'Timesheet added successfully', id: result.insertId });
            } else {
                return res.status(500).json({ success: false, message: 'Failed to add timesheet' });
            }
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
    const employeeId = req.params.id;
    const sql = "SELECT * FROM timesheet WHERE employee_id = ?";
    con.query(sql, [employeeId], (err, result) => {
        if (err) {
            return res.status(500).json({ Status: false, Error: "Internal Server Error" });
        } else {
            return res.status(200).json({ Status: true, Result: result });
        }
    });
});


// Endpoint to archive a timesheet
router.put('/archive_employee_timesheet/:id', (req, res) => {
  const timesheetId = req.params.id;

  con.query('UPDATE timesheets SET archived = true WHERE id = ?', [timesheetId], (error, results) => {
    if (error) {
      console.error('Error archiving timesheet:', error);
      return res.status(500).json({ status: false, error: 'Error archiving timesheet' });
    }

    return res.json({ status: true, message: 'Timesheet archived successfully' });
  });
});

// Endpoint to unarchive a timesheet
router.put('/unarchive_employee_timesheet/:id', (req, res) => {
  const timesheetId = req.params.id;

  con.query('UPDATE timesheets SET archived = false WHERE id = ?', [timesheetId], (error, results) => {
    if (error) {
      console.error('Error unarchiving timesheet:', error);
      return res.status(500).json({ status: false, error: 'Error unarchiving timesheet' });
    }

    return res.json({ status: true, message: 'Timesheet unarchived successfully' });
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

router.get('/payslip_count/:id', (req, res) => {
  const employeeId = req.params.id; // Extract employee ID from request parameters
  const sql = "SELECT COUNT(id) AS payslips FROM payslips WHERE employee_id = ?";
  con.query(sql, [employeeId], (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error: " + err});
    return res.json({Status: true, Result: result});
  });
});



  
router.delete('/delete_employee_timesheet/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from timesheet where id = ?";
    con.query(sql, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
      return res.json({ Status: true, Result: result });
    });
  });

  router.put("/edit_employee_timesheet/:id", (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE timesheet 
                 SET employee_id = ?, date = ?, start_time = ?, end_time = ?, hours_worked = ?, notes = ?
                 WHERE id = ?`;
    const values = [
      req.body.employeeId,
      req.body.date,
      req.body.startTime,
      req.body.endTime,
      req.body.hoursWorked,
      req.body.notes,
    ];
    con.query(sql, [...values, id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
      return res.json({ Status: true, Result: result });
    });
  });
  
  router.get('/employee_pay/:id', (req, res) => {
    const employeeId = req.params.id; // Assuming the employee ID is passed as a parameter
  
    const sql = "SELECT * FROM payslips WHERE employee_id = ?";
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