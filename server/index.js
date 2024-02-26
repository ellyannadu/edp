const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES //

// Create an employee
app.post("/employee", async (req, res) => {
  try {
    const {
      first_name, middle_name, last_name, birthdate, contact_num, email, address_line, barangay, city, province, zip_code
    } = req.body;
    
    const newEmployeeQuery = `
    INSERT INTO employee 
      (first_name, middle_name, last_name, birthdate, contact_num, email, address_line, barangay, city, province, zip_code) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING employee_id `;

    const newEmployee = await pool.query(newEmployeeQuery, [
      first_name, middle_name, last_name, birthdate, contact_num, email, address_line, barangay, city, province, zip_code
    ]);

    // Return the employee_id in the response in script.js
    res.status(201).json({ employee_id: newEmployee.rows[0].employee_id });
  } catch (err) {
    console.error("Error adding employee:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}); 

// Assign employee designation
app.post("/assign-designation", async (req, res) => {
  try {
    const {
      employee_id, designation_id, employee_type, employee_status, designation_date
    } = req.body;
    
    const assignDesignationQuery = `
    INSERT INTO assign_designation 
      (employee_id, designation_id, employee_type, employee_status, designation_date)
    VALUES 
      ($1, $2, $3, $4, $5)
    RETURNING * `;

    const assignDesignation = await pool.query(assignDesignationQuery, [
      employee_id, designation_id, employee_type, employee_status, designation_date
    ]);

    res.json(assignDesignation.rows[0]);
  } catch (err) {
    console.error("Error assigning designation:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all employees
app.get("/employee", async(req, res) => {
  try {
    const allEmployees = await pool.query("SELECT * FROM employee ORDER BY employee_id ASC");
    res.json(allEmployees.rows);
  } catch (err) {
    console.error("Cannot get employees:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single employee
app.get("/employee/:id", async (req, res) => {
  try {
    const{id} = req.params;
    const employee = await pool.query("SELECT * FROM employee WHERE employee_id = $1", [id]);
    res.json(employee.rows[0]);
  } catch (err) {
    console.error("Cannot get x employee:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get assigned designation of an employee
app.get("/assign-designation/:id", async (req, res) => {
  try {
    const{id} = req.params;
    const assignDesignation = await pool.query("SELECT * FROM assign_designation WHERE employee_id = $1", [id]);
    res.json(assignDesignation.rows[0]);
  } catch (err) {
    console.error("Cannot get x employee designation:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get employee JOINED with designation, status, type
app.get("/employees", async(req, res) => {
  try {
    const allEmployees = await pool.query(`
    SELECT e.employee_id, e.first_name, e.middle_name, e.last_name, d.designation_name, dep.department_name, es.employee_status_name, ad.designation_date
    FROM employee e
    LEFT JOIN assign_designation ad ON e.employee_id = ad.employee_id
    LEFT JOIN designation d ON ad.designation_id = d.designation_id
    LEFT JOIN department dep ON d.department_id = dep.department_id
    LEFT JOIN employee_status es ON ad.employee_status = es.employee_status_id;`);
    res.json(allEmployees.rows);
  } catch (err) {
    console.error("Cannot get employees:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an employee
app.put("/employee/:id", async (req, res) => {
  try {
    const{id} = req.params;
    const {
      first_name, middle_name, last_name, birthdate, contact_num, email, address_line, barangay, city, province, zip_code
    } = req.body;

    const updateEmployee = await pool.query(`
      UPDATE employee
      SET first_name = $1, middle_name = $2, last_name = $3, birthdate = $4, contact_num = $5, email = $6, address_line = $7, barangay = $8, city = $9, province = $10, zip_code = $11
      WHERE employee_id = $12`, 
      [first_name, middle_name, last_name, birthdate, contact_num, email, address_line, barangay, city, province, zip_code, id]
    );
      res.json("Employee was updated");
    } catch (err) {
    console.log("Cannot update employee:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an employee designation
app.put("/assign-designation/:id", async (req, res) => {
  try {
    const{id} = req.params;
    const {
      designation_id, employee_type, employee_status, designation_date
    } = req.body;

    const updateDesignation = await pool.query(`
      UPDATE assign_designation
      SET designation_id = $1, employee_type = $2, employee_status = $3, designation_date = $4
      WHERE employee_id = $5`, 
      [designation_id, employee_type, employee_status, designation_date, id]
    );
      res.json("Employee designation was updated");
    } catch (err) {
    console.log("Cannot update employee designation:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete an employee
app.delete("/employee/:id", async (req, res) => {
  try {
    const{id} = req.params;
    await pool.query("DELETE FROM assign_designation WHERE employee_id = $1", [id]);
    const deleteEmployee = await pool.query("DELETE FROM employee WHERE employee_id = $1", [id]);
    res.json("Employee was deleted");
  } catch (err) {
    console.log("Cannot delete employee", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
