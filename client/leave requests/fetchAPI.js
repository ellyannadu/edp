import { displayLeave } from "./leave_request.js";

// Function to fetch all leave
export async function getLeaves() {
  try {
    const response = await fetch('http://localhost:3000/leave');
    if (!response.ok) {
      throw new Error('Failed to fetch leaves');
    }
    const allLeave = await response.json();
    displayLeave(allLeave);
  } catch (error) {
    console.error('Error fetching leave:', error);
  }
}

// Function to add a new leave
export async function addLeave() {
  try {
    const response = await fetch('http://localhost:3000/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({
        leave_start: '2022-12-01',
        leave_end: '2022-12-10',
        leave_type_id: 1,
        employee_id: 1,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to add leave');
    }
    getLeaves();
  } catch (error) {
    console.error('Error adding leave:', error);
  }
}

// Fetch all employees + populate dropdown
export async function getEmployeesAndPopulateDropdown() {
  try {
    const response = await fetch('http://localhost:3000/employee');
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    const allEmployees = await response.json();

    // Get the dropdown element from the HTML
    const employeeDropdown = document.getElementById('employee-dropdown');

    // Clear existing options in the dropdown
    employeeDropdown.innerHTML = '';

    // Add default "Select" option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select';
    defaultOption.value = ''; // Set the value to an empty string or 'select' as needed
    defaultOption.selected = true; // Select the default option
    employeeDropdown.appendChild(defaultOption);
    
    // Populate the dropdown with employees' names
    allEmployees.forEach(employee => {
      const option = document.createElement('option');
      option.text = `${employee.last_name}, ${employee.first_name} ${employee.middle_name}`;
      option.value = employee.employee_id; // Set the value to the employee's ID if needed
      employeeDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
}
