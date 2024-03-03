import { closeModal, fetchEmployees } from './view_employees.js';

// Event listener for the info modal
infoModal.addEventListener('click', async function(event) {
    const target = event.target;

    if (target.classList.contains('edit-button')) {
        const editButton = document.getElementById('editButton');
        const saveButton = document.getElementById('saveButton');
        const deleteButton = document.getElementById('deleteButton');
        const cancelButton2 = document.getElementById('cancelButton2');

        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            if (input.name !== 'employee_id'){
                input.removeAttribute('readonly');
            }
        });

        deleteButton.style.display = 'none';
        editButton.style.display = 'none';
        saveButton.style.display = 'block';
        cancelButton2.style.display = 'block';
    } else if (target.classList.contains('delete-button')) {
        // Get the employee ID from the modal body
        const employeeId = document.querySelector('[name="employee_id"]').value;

    try {
        // Delete the employee from the database
        const response = await fetch(`http://localhost:3000/employee/${employeeId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete employee');
        }

        closeModal();
        fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    } else if (target.classList.contains('cancel-button-2')) {
        deleteButton.style.display = 'block';
        editButton.style.display = 'block';
        saveButton.style.display = 'none';
        cancelButton2.style.display = 'none';

        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            input.setAttribute('readonly', '');
        });

    } else if (target.classList.contains('save-button')) {
        // Save button clicked
        const employeeId = document.querySelector('[name="employee_id"]').value;
        const inputs = infoModal.querySelectorAll('input[type="text"]');
        const updatedEmployee = {};
    
        inputs.forEach(input => {
            if (input.name !== 'employee_id' && input.value !== 'undefined') {
                updatedEmployee[input.name] = input.value;
            }
        });
        try {
          // Update the employee data on the server
          const response = await fetch(`http://localhost:3000/employee/${employeeId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEmployee)
          });
    
          if (!response.ok) {
            throw new Error('Failed to update employee');
          }
          
          deleteButton.style.display = 'block';
          editButton.style.display = 'block';
          saveButton.style.display = 'none';
          cancelButton2.style.display = 'none';
  
          const inputs = document.querySelectorAll('input[type="text"]');
          inputs.forEach(input => {
              input.setAttribute('readonly', '');
          });

          alert('Employee updated successfully');
          // Refresh the employee list
          fetchEmployees();
        } catch (error) {
          console.error('Error updating employee:', error);
          console.log(updatedEmployee);

        }
    }
});

// Prevent default form submission for edit and delete buttons
infoModal.addEventListener('submit', function(event) {
    event.preventDefault();
});