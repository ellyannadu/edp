CREATE DATABASE employeelist;

CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    contact_num VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    barangay VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL
);

CREATE TABLE employee_status (
    employee_status_id SERIAL PRIMARY KEY,
    employee_status_name VARCHAR(255) NOT NULL
);

CREATE TABLE employee_type (
    employee_type_id SERIAL PRIMARY KEY,
    employee_type_name VARCHAR(255) NOT NULL
);

CREATE TABLE department_status (
    department_status_id SERIAL PRIMARY KEY,
    department_status_name VARCHAR(255) NOT NULL
);

CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    department_status INT NOT NULL,
    FOREIGN KEY (department_status) REFERENCES department_status(department_status_id)
);

CREATE TABLE designation (
    designation_id SERIAL PRIMARY KEY,
    designation_name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE assign_designation (
    assign_designation_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    designation_id INT NOT NULL,
    employee_type INT NOT NULL,
    employee_status INT NOT NULL,
    designation_date DATE,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (designation_id) REFERENCES designation(designation_id),
    FOREIGN KEY (employee_type) REFERENCES employee_type(employee_type_id),
    FOREIGN KEY (employee_status) REFERENCES employee_status(employee_status_id)
);

CREATE TABLE leave (
    leave_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_start DATE NOT NULL,
    leave_end DATE NOT NULL,
    leave_type INT NOT NULL,
    leave_status INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (leave_type) REFERENCES leave_type(leave_type_id),
    FOREIGN KEY (leave_status) REFERENCES employee_status(employee_status_id)
);

CREATE TABLE leave_type (
    leave_type_id SERIAL PRIMARY KEY,
    leave_type_name VARCHAR(255) NOT NULL
);

CREATE TABLE leave_status (
    leave_status_id SERIAL PRIMARY KEY,
    leave_status_name VARCHAR(255) NOT NULL
);

CREATE TABLE signatories (
    signatory_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    superior_id INT,
    superior_status INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (superior_id) REFERENCES employee(employee_id),
    FOREIGN KEY (superior_status) REFERENCES superior_status(superior_status_id)
);

CREATE TABLE superior_status (
    superior_status_id SERIAL PRIMARY KEY,
    superior_status_name VARCHAR(255) NOT NULL
);

-- QUERIES START (IN ORDER):

-- ADD EMPLOYEE status
INSERT INTO employee_status (employee_status_name) VALUES 
    ('Active'),
    ('On Leave'),
    ('Resigned'),
    ('Terminated'),
    ('Retired');

-- ADD EMPLOYEE type
INSERT INTO employee_type (employee_type_name) VALUES 
    ('Regular'),
    ('Part Time'),
    ('Contractual'),
    ('OJT'),
    ('Intern');

-- ADD department status
INSERT INTO department_status (department_status_name) VALUES
    ('Active'),
    ('Inactive'),
    ('Closed');

-- ADD department
INSERT INTO department (department_name, department_status) VALUES
    ('Sales', 1),
    ('Marketing', 1),
    ('Finance', 1),
    ('Human Resources', 1),
    ('Information Technology', 1),
    ('Operations', 1),
    ('Customer Service', 1),
    ('Research and Development', 1),
    ('Production', 1),
    ('Quality Assurance', 1);

-- ADD DESIGNATION
INSERT INTO designation (designation_name, department_id) VALUES 
    ('Sales Manager', 1),  -- Sales
    ('Sales Representative', 1),
    ('Marketing Manager', 2),  -- Marketing
    ('Marketing Specialist', 2),
    ('Financial Analyst', 3),  -- Finance
    ('Accountant', 3),
    ('HR Manager', 4),  -- Human Resources
    ('HR Coordinator', 4),
    ('IT Manager', 5),  -- Information Technology
    ('IT Specialist', 5),
    ('Operations Manager', 6),  -- Operations
    ('Operations Supervisor', 6),
    ('Customer Service Manager', 7),  -- Customer Service
    ('Customer Service Representative', 7),
    ('R&D Manager', 8),  -- Research and Development
    ('Research Scientist', 8),
    ('Production Manager', 9),  -- Production
    ('Production Worker', 9),
    ('Quality Assurance Manager', 10),  -- Quality Assurance
    ('Quality Assurance Specialist', 10);


-- ADD EMPLOYEES
INSERT INTO employee (first_name, middle_name, last_name, birthdate, contact_num, email, address_line, barangay, city, province, zip_code)
VALUES 
    ('Brad', 'William', 'Pitt', '1963-12-18', '09223344556', 'bradpitt@gmail.com', '123 Mangga St', 'Matina Aplaya', 'Los Angeles', 'Davao del Norte', '8100'),
    ('Angelina', 'Jolie', 'Voight', '1975-06-04', '09112239293', 'angelinajolie@gmail.com', '456 Apple St', 'Bucana', 'Davao', 'Davao del Sur', '8000'),
    ('Leonardo', 'Wilhelm', 'DiCaprio', '1974-11-11', '09898912321', 'leonardodicaprio@gmail.com', '789 Durian St', 'Pangi', 'Tagum', 'Davao Oriental', '8200');

-- ASSIGN DESIGNATIONS TO EMPLOYEES
INSERT INTO assign_designation (employee_id, designation_id, employee_type_id, employee_status_id, designation_date) VALUES
    (1, 1, 1, 1, '2024-02-01'),
    (2, 3, 2, 2, '2024-12-10'),
    (3, 5, 3, 3, '2024-08-01');

-- ADD LEAVE TYPES
INSERT INTO leave_type (leave_type_name) VALUES
    ('Vacation Leave'),
    ('Personal Leave'),
    ('Sick Leave'),
    ('Maternity Leave'),
    ('Paternity Leave'),
    ('Emergency Leave');

-- ADD LEAVE STATUS
INSERT INTO leave_status (leave_status_name) VALUES
    ('Pending'),
    ('Approved'),
    ('Denied');

-- ADD SUPERIOR STATUS
INSERT INTO superior_status (superior_status_name) VALUES
    ('Active'),
    ('Inactive');

INSERT INTO signatories (employee_ID, superior_ID, superior_status) VALUES (7, 8, 1);

-- JOIN STATEMENTS
SELECT e.employee_id, e.first_name, e.middle_name, e.last_name, d.designation_name, dep.department_name, es.employee_status_name, ad.designation_date
FROM employee e
LEFT JOIN assign_designation ad ON e.employee_id = ad.employee_id
LEFT JOIN designation d ON ad.designation_id = d.designation_id
LEFT JOIN department dep ON d.department_id = dep.department_id
LEFT JOIN employee_status es ON ad.employee_status = es.employee_status_id;

-- WHEN AN EMPLOYEE IS DELETED, ASSIGN DESIGNATION IS ALSO DELETED
ALTER TABLE assign_designation
ADD CONSTRAINT fk_employee_id
FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
ON DELETE CASCADE;


SELECT*FROM employee ORDER BY employee_id ASC;
SELECT*FROM employee_status;
SELECT*FROM employee_type;
SELECT*FROM department_status;
SELECT*FROM department;
SELECT*FROM designation;
SELECT*FROM assign_designation;
