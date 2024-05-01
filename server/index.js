console.log("Starting the server...");

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

// Create a leave request
app.post("/leave", async (req, res) => {
  try {
    const {
      employee_id, leave_type, leave_start, leave_end, leave_status
    } = req.body;
    
    const newLeaveQuery = `
    INSERT INTO leave 
      (employee_id, leave_type, leave_start, leave_end, leave_status) 
    VALUES 
      ($1, $2, $3, $4, $5)
    RETURNING * `;

    const newLeave = await pool.query(newLeaveQuery, [
      employee_id, leave_type, leave_start, leave_end, leave_status
    ]);

    console.log(newLeave.rows[0]);

    res.json(newLeave.rows[0]);
  } catch (err) {
    console.error("Error adding leave request:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a signatory request
app.post("/signatory", async (req, res) => {
  try {
    const {
      employee_id, superior_id, superior_status
    } = req.body;
    
    const newSignatoryQuery = `
    INSERT INTO signatories 
      (employee_ID, superior_ID, superior_status)
    VALUES 
      ($1, $2, $3)
    RETURNING * `;

    const newSignatory = await pool.query(newSignatoryQuery, [
      employee_id, superior_id, superior_status
    ]);

    console.log(newSignatory.rows[0]);

    res.json(newSignatory.rows[0]);

  } catch (err) {
    console.error("Error adding signatory requests:", err.message);
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
    const { id } = req.params;
    const assignDesignation = await pool.query(`
    SELECT
      ad.assign_designation_id,
      e.employee_id,
      e.first_name,
      e.middle_name,
      e.last_name,
      d.department_id,
      d.department_name,
      des.designation_id,
      des.designation_name,
      ad.employee_type,
      et.employee_type_name,
      ad.employee_status,
      es.employee_status_name,
      ad.designation_date
    FROM
      assign_designation ad
      JOIN employee e ON ad.employee_id = e.employee_id
      JOIN designation des ON ad.designation_id = des.designation_id
      JOIN department d ON des.department_id = d.department_id
      JOIN employee_type et ON ad.employee_type = et.employee_type_id
      JOIN employee_status es ON ad.employee_status = es.employee_status_id
    WHERE ad.employee_id = $1`, [id]);
    res.json(assignDesignation.rows[0]);
  } catch (err) {
    console.error("Cannot get employee designation:", err.message);
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

// Get department
app.get("/department", async(req, res) => {
  try {
    const allDepartments = await pool.query("SELECT * FROM department ORDER BY department_id ASC");
    res.json(allDepartments.rows);
  } catch (err) {
    console.error("Cannot get departments:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get designation
app.get("/designation", async(req, res) => {
  try {
    const allDesignations = await pool.query("SELECT * FROM designation ORDER BY designation_id ASC");
    res.json(allDesignations.rows);
  } catch (err) {
    console.error("Cannot get designations:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get employee status
app.get("/employee-status", async(req, res) => {
  try {
    const allEmployeeStatus = await pool.query("SELECT * FROM employee_status ORDER BY employee_status_id ASC");
    res.json(allEmployeeStatus.rows);
  } catch (err) {
    console.error("Cannot get employee status:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get employee type
app.get("/employee-type", async(req, res) => {
  try {
    const allEmployeeType = await pool.query("SELECT * FROM employee_type ORDER BY employee_type_id ASC");
    res.json(allEmployeeType.rows);
  } catch (err) {
    console.error("Cannot get employee type:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all leave requests joined with employee first name and last name, leave type, leave status
app.get("/leave", async(req, res) => {
  try {
    const allLeaves = await pool.query(`
    SELECT l.leave_id, e.employee_id, e.first_name, e.last_name, e.middle_name, lt.leave_type_name, ls.leave_status_name, l.leave_start, l.leave_end, l.leave_type, l.leave_status
    FROM leave l
    LEFT JOIN employee e ON l.employee_id = e.employee_id
    LEFT JOIN leave_type lt ON l.leave_type = lt.leave_type_id
    LEFT JOIN leave_status ls ON l.leave_status = ls.leave_status_id
    ORDER BY l.leave_id;`);
    res.json(allLeaves.rows);
  } catch (err) {
    console.error("Cannot get leaves:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all signatories joined with employee first name and last name, superior name, superior status
app.get("/signatory", async(req, res) => {
  try {
    const allSignatories = await pool.query(`
    SELECT 
    s.signatory_id, 
    e.employee_id AS signatory_employee_id, 
    e.first_name AS signatory_first_name, 
    e.middle_name AS signatory_middle_name, 
    e.last_name AS signatory_last_name, 
    s.superior_id, 
    e2.first_name AS superior_first_name, 
    e2.middle_name AS superior_middle_name, 
    e2.last_name AS superior_last_name,  
    s.superior_status,
    ss.superior_status_name
    FROM 
        signatories s
    LEFT JOIN 
        employee e ON s.employee_id = e.employee_id
    LEFT JOIN 
        employee e2 ON s.superior_id = e2.employee_id
    LEFT JOIN 
        superior_status ss ON s.superior_status = ss.superior_status_id
    ORDER BY 
        s.signatory_id;`);
    res.json(allSignatories.rows);
  } catch (err) {
    console.error("Cannot get signatories:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get all sss, pagibig, philhealth, tax of an employee
app.get("/contributions/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const allContributions = await pool.query(`
    SELECT 
      s.employee_contrib AS sss_contrib,
      p.employee_contrib AS pagibig_contrib,
      ph.employee_contrib AS philhealth_contrib,
      t.amount AS tax_amount
    FROM 
      sss s
    LEFT JOIN 
      pagibig p ON s.employee_id = p.employee_id
    LEFT JOIN 
      philhealth ph ON p.employee_id = ph.employee_id
    LEFT JOIN 
      tax t ON ph.employee_id = t.employee_id
    WHERE 
      s.employee_id = $1`, [id]);
    res.json(allContributions.rows);
  } catch (err) {
    console.error("Cannot get contributions:", err.message);
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

// Update a leave request
app.put("/leave/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      leave_id, employee_id, leave_start, leave_end, leave_type, leave_status
    } = req.body;

    const updateLeave = await pool.query(`
      UPDATE leave
      SET employee_id = $1, leave_start = $2, leave_end = $3, leave_type = $4, leave_status = $5
      WHERE leave_id = $6`, 
      [employee_id, leave_start, leave_end, leave_type, leave_status, leave_id]
    );

    res.json("Leave request was updated");
  } catch (err) {
    console.log("Cannot update leave request:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a signatory request
app.put("/signatory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, superior_id, superior_status } = req.body;

    const updateSignatory = await pool.query(`
      UPDATE signatories
      SET employee_id = $1, superior_id = $2, superior_status = $3
      WHERE signatory_id = $4`, 
      [employee_id, superior_id, superior_status, id]
    );

    res.json("Signatory request was updated");
  } catch (err) {
    console.error("Cannot update signatory request:", err.message);
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


// ======================= PAYROLL =======================
// Add a deduction
app.post("/deductions", async (req, res) => {
  try {
    const { employee_id, deduction_type, deduction_date, deduction_amount } = req.body;
    const newDeduction = await pool.query(`
      INSERT INTO deductions
      (employee_id, deduction_type, deduction_date, deduction_amount)
      VALUES
      ($1, $2, $3, $4)
      RETURNING *`, [employee_id, deduction_type, deduction_date, deduction_amount]);
    res.json(newDeduction.rows[0]);
  } catch (err) {
    console.error("Error adding deduction:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add an earning
app.post("/earnings", async (req, res) => {
  try {
    const { employee_id, earning_type, earning_date, earning_amount } = req.body;
    const newEarning = await pool.query(`
      INSERT INTO earnings
      (employee_id, earning_type, earning_date, earning_amount)
      VALUES
      ($1, $2, $3, $4)
      RETURNING *`, [employee_id, earning_type, earning_date, earning_amount]);
    res.json(newEarning.rows[0]);
  } catch (err) {
    console.error("Error adding earning:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a payroll
app.post('/payroll', async (req, res) => {
  const { start_date, end_date, pay_date, status } = req.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO payroll (start_date, end_date, pay_date, status) 
      VALUES ($1, $2, $3, $4)
      RETURNING payroll_id`,
      [start_date, end_date, pay_date, status]
    );
    const { payroll_id } = rows[0];
    res.status(201).json({ payroll_id });
  } catch (error) {
    console.error('Error creating payroll record:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get all deductions
app.get("/deductions", async(req, res) => {
  try {
    const allDeductions = await pool.query("SELECT * FROM deductions ORDER BY deduction_id ASC");
    res.json(allDeductions.rows);
  } catch (err) {
    console.error("Cannot get deductions:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all earnings
app.get("/earnings", async(req, res) => {
  try {
    const allEarnings = await pool.query("SELECT * FROM earnings ORDER BY earning_id ASC");
    res.json(allEarnings.rows);
  } catch (err) {
    console.error("Cannot get earnings:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all payroll records
app.get('/payroll', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM payroll');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching payroll data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET 1 payroll record
app.get('/payroll/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM payroll WHERE payroll_id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Payroll record not found');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching payroll data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a deduction
app.put("/deductions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, deduction_type, deduction_date, deduction_amount } = req.body;
    const updateDeduction = await pool.query(`
      UPDATE deductions
      SET employee_id = $1, deduction_type = $2, deduction_date = $3, deduction_amount = $4
      WHERE deduction_id = $5`, [employee_id, deduction_type, deduction_date, deduction_amount, id]);
    res.json("Deduction was updated");
  } catch (err) {
    console.error("Cannot update deduction:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an earning
app.put("/earnings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, earning_type, earning_date, earning_amount } = req.body;
    const updateEarning = await pool.query(`
      UPDATE earnings
      SET employee_id = $1, earning_type = $2, earning_date = $3, earning_amount = $4
      WHERE earning_id = $5`, [employee_id, earning_type, earning_date, earning_amount, id]);
    res.json("Earning was updated");
  } catch (err) {
    console.error("Cannot update earning:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a deduction
app.delete("/deductions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDeduction = await pool.query("DELETE FROM deductions WHERE deduction_id = $1", [id]);
    res.json("Deduction was deleted");
  } catch (err) {
    console.error("Cannot delete deduction:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete an earning
app.delete("/earnings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEarning = await pool.query("DELETE FROM earnings WHERE earning_id = $1", [id]);
    res.json("Earning was deleted");
  } catch (err) {
    console.error("Cannot delete earning:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ========= PAYROLL REPORT =========
// Add to philHealth
app.post("/philHealth", async (req, res) => {
  try {
    const { employee_contrib, employer_contrib, totalAmount, date, employee_id } = req.body;
    const newPhilHealth = await pool.query(`
      INSERT INTO philHealth
      (employee_contrib, employer_contrib, totalAmount, date, employee_id)
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING philHealth_id`, [employee_contrib, employer_contrib, totalAmount, date, employee_id]);
    res.json(newPhilHealth.rows[0]);
  } catch (err) {
    console.error("Error adding PhilHealth:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add to pagIbig
app.post("/pagIbig", async (req, res) => {
  try {
    const { employee_contrib, employer_contrib, totalAmount, date, employee_id } = req.body;
    const newPagIbig = await pool.query(`
      INSERT INTO pagIbig
      (employee_contrib, employer_contrib, totalAmount, date, employee_id)
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING pagIbig_id`, [employee_contrib, employer_contrib, totalAmount, date, employee_id]);
    res.json(newPagIbig.rows[0]);
  } catch (err) {
    console.error("Error adding PagIbig:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add to sss
app.post("/sss", async (req, res) => {
  try {
    const { employee_contrib, employer_contrib, totalAmount, date, employee_id } = req.body;
    const newSSS = await pool.query(`
      INSERT INTO sss
      (employee_contrib, employer_contrib, totalAmount, date, employee_id)
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING sss_id`, [employee_contrib, employer_contrib, totalAmount, date, employee_id]);
    res.json(newSSS.rows[0]);
  } catch (err) {
    console.error("Error adding SSS:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Add to tax
app.post("/tax", async (req, res) => {
  try {
    const { amount, date, employee_id } = req.body;
    const newTax = await pool.query(`
      INSERT INTO tax
      (amount, date, employee_id)
      VALUES
      ($1, $2, $3)
      RETURNING tax_id`, [amount, date, employee_id]);
    res.status(201).json(newTax.rows[0]);
  } catch (err) {
    console.error("Error adding Tax:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get payslip of an employee within the specified date range
app.get("/payslip/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payslip = await pool.query(`
    SELECT
      emp.employee_id,
      emp.first_name,
      emp.middle_name,
      emp.last_name,
      ded.deduction_id,
      ded.deduction_type,
      ded.deduction_date,
      ded.deduction_amount,
      ear.earning_id,
      ear.earning_type,
      ear.earning_date,
      ear.earning_amount,
      ph.employee_contrib AS philHealth_contrib,
      pg.employee_contrib AS pagIbig_contrib,
      sss.employee_contrib AS sss_contrib,
      tx.amount AS tax_amount,
      p.start_date,
      p.end_date,
      p.pay_date
    FROM
      employee emp
    LEFT JOIN
      deductions ded ON emp.employee_id = ded.employee_id AND ded.deduction_date BETWEEN p.start_date AND p.end_date
    LEFT JOIN
      earnings ear ON emp.employee_id = ear.employee_id AND ear.earning_date BETWEEN p.start_date AND p.end_date
    LEFT JOIN
      philHealth ph ON emp.employee_id = ph.employee_id AND ph.date BETWEEN p.start_date AND p.end_date
    LEFT JOIN
      pagIbig pg ON emp.employee_id = pg.employee_id AND pg.date BETWEEN p.start_date AND p.end_date
    LEFT JOIN
      sss ON emp.employee_id = sss.employee_id AND sss.date BETWEEN p.start_date AND p.end_date
    LEFT JOIN
      tax tx ON emp.employee_id = tx.employee_id AND tx.date BETWEEN p.start_date AND p.end_date
    WHERE emp.employee_id = $1`, [id]);

    res.json(payslip.rows);
  } catch (err) {
    console.error("Cannot get employee payslip:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
