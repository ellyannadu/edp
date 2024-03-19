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