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

// Fetch all employees + populate dropdown
export async function getEmployeesAndPopulateList() {
  try {
    const response = await fetch('http://localhost:3000/employee');
    if (!response.ok) {
        throw new Error('Failed to fetch employees');
    }
    const allEmployees = await response.json();

    const employeeLists = document.querySelectorAll('.employee-list');
    employeeLists.forEach(employeeList => {
        employeeList.innerHTML = ''; // Clear existing content
        allEmployees.forEach(employee => {
            const listItem = document.createElement('div');
            listItem.classList.add('employee-list-item');
            listItem.textContent = `${employee.last_name}, ${employee.first_name} ${employee.middle_name}`;
            listItem.dataset.value = employee.employee_id;
            employeeList.appendChild(listItem);
        });
    });
  } catch (error) {
      console.error('Error fetching employees:', error);
  }
}


// Function to submit/add a new leave request
export async function submitLeaveRequest(requestData) {
  try {
    const response = await fetch('http://localhost:3000/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Failed to submit leave request');
    }

    const data = await response.json(); // Parse response as JSON
    console.log('Leave request submitted successfully:', data);
    getLeaves();
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred, please try again later');
  }
}

// Function to update a leave request of a specific ID
export async function updateLeaveRequest(requestedData) {
  try {
    console.log('emp ID:', requestedData.employee_id);
    const response = await fetch(`http://localhost:3000/leave/${requestedData.leave_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestedData)
    });

    if (!response.ok) {
      throw new Error('Failed to update leave request');
    }

    const data = await response.json(); 
    console.log('Leave request updated successfully:', requestedData);
    getLeaves();
  } catch(error) {
    console.error('Error:', error);
    alert('An error occurred, please try again later');
  }
}