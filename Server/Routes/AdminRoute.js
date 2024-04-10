import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from "multer";
import path from "path";



const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});


router.get("/category", (req, res) => {
  const sql = "SELECT * FROM category";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

router.post('/add_user', (req, res) => {
  const { email, password } = req.body; // Destructure email and password from the request body

  // Ensure both email and password are provided
  if (!email || !password) {
    return res.status(400).json({Status: false, Error: "Email and password are required"});
  }

  const sql = "INSERT INTO admin (`email`, `password`) VALUES (?, ?)"; // Correct SQL statement

  con.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.json({Status: false, Error: "Query Error"});
    }
    return res.json({Status: true, Result: result});
  });
});




router.post('/add_task', (req, res) => {
  const { name, description, deadline, employee_id, category_id } = req.body;

  const sql = `INSERT INTO tasks (name, description, deadline, employee_id, category_id) VALUES (?, ?, ?, ?, ?)`;
  const values = [name, description, deadline, employee_id, category_id];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ Status: false, Error: "Query Error" });
    }

    return res.json({ Status: true });
  });
});


// image upload 
// image upload 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'Public/Images')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage
})
// end imag eupload 

router.post('/add_employee',upload.single('image'), (req, res) => {
  const sql = `INSERT INTO employee 
  (name,email,password, address, salary,image, category_id) 
  VALUES (?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
      if(err) return res.json({Status: false, Error: "Query Error"})
      const values = [
          req.body.name,
          req.body.email,
          hash,
          req.body.address,
          req.body.salary, 
          req.file.filename,
          req.body.category_id
      ]
      con.query(sql, [values], (err, result) => {
          if(err) return res.json({Status: false, Error: err})
          return res.json({Status: true})
      })
  })
})

router.delete('/delete_user/:id', (req, res) => {
  const id = req.params.id;
  const sql = "delete from admin where id = ?"
  con.query(sql,[id], (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})




router.get('/tasks', (req, res) => {
  const sql = "SELECT * FROM tasks";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"})
      return res.json({Status: true, Result: result})
  })
})

router.delete('/delete_tasks/:id', (req, res) => {
  const id = req.params.id;
  const sql = "delete from tasks where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});


router.get('/admin/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM admin WHERE id = ?";
  con.query(sql,[id], (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"})
      return res.json({Status: true, Result: result})
  })
})

router.put('/edit_user/:id', (req, res) => {
  const { id } = req.params; // User ID from URL parameters
  const { email, password } = req.body; // User's new data from request body

  // Validation (should be more thorough in production code)
  if (!email || !password) {
    return res.status(400).json({ Status: false, Error: 'Email and password are required.' });
  }

  // SQL query to update the user
  // This is a generic SQL statement, you should adapt it to your database schema
  // Also, ensure password is hashed (e.g., with bcrypt) before storing in the database
  const sql = 'UPDATE admin SET email = ?, password = ? WHERE id = ?';

  db.query(sql, [email, password, id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ Status: false, Error: 'Failed to update the user.' });
    }

    if (result.affectedRows === 0) {
      // No rows updated, which means the user doesn't exist
      return res.status(404).json({ Status: false, Error: 'User not found.' });
    }

    // Successfully updated the user
    res.json({ Status: true, Message: 'User updated successfully.' });
  });
});






router.get('/employee', (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"})
      return res.json({Status: true, Result: result})
  })
})

router.get('/employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql,[id], (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"})
      return res.json({Status: true, Result: result})
  })
})

router.put('/edit_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE employee 
      set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
      Where id = ?`
  const values = [
      req.body.name,
      req.body.email,
      req.body.salary,
      req.body.address,
      req.body.category_id
  ]
  con.query(sql,[...values, id], (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.delete('/delete_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "delete from employee where id = ?"
  con.query(sql,[id], (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.delete("/delete_category/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM category WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/admin_count', (req, res) => {
  const sql = "select count(id) as admin from admin";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/employee_count', (req, res) => {
  const sql = "select count(id) as employee from employee";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/salary_count', (req, res) => {
  const sql = "select sum(salary) as salaryOFEmp from employee";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/admin_records', (req, res) => {
  const sql = "select * from admin"
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.post('/add_attendance', (req, res) => {
  const { employee_id, date, status, time_in, time_out, notes } = req.body;

  const sql = `INSERT INTO attendance (employee_id, date, status, time_in, time_out, notes) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [employee_id, date, status, time_in, time_out, notes];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ Status: false, Error: "Query Error" });
    }

    return res.json({ Status: true });
  });
});

router.get('/attendance', async (req, res) => {
  try {
    // Query the database to fetch attendance data
    const attendanceData = await db.query('SELECT * FROM attendance');
    // Send the attendance data as a response
    res.json({ Status: true, Result: attendanceData });
  } catch (error) {
    // If an error occurs, send an error response
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ Status: false, Error: 'Failed to fetch attendance data' });
  }
});






router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({Status: true})
})








export {router as adminRouter}