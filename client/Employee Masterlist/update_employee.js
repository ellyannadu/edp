import { closeModal, fetchEmployees } from './view_employees.js';

let departmentDropdown;
let designationDropdown;
let typeDropdown;
let statusDropdown;

let departmentInput;
let designationInput;
let typeInput;
let statusInput;
let dependentOptions;

// Event listener for the info modal
infoModal.addEventListener('click', async function(event) {
    const target = event.target;
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const deleteButton = document.getElementById('deleteButton');
    const cancelButton2 = document.getElementById('cancelButton2');

    if (target.classList.contains('edit-button')) {
        // Query the relevant input elements from the DOM
        departmentInput = document.querySelector('input[name="department"]');
        designationInput = document.querySelector('input[name="designation"]');
        typeInput = document.querySelector('input[name="type"]');
        statusInput = document.querySelector('input[name="status"]');

        // Store current values of input elements
        let current_departmentValue, current_designationValue, current_typeValue, current_statusValue;

        // Fetch assignment details for a specific employee
        const fetchAssignmentDetails = async (employeeId) => {
            try {
                const response = await fetch(`http://localhost:3000/assign-designation/${employeeId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch assignment details");
                }
                const data = await response.json();
    
                // Update input values with fetched assignment details
                if (data) {
                    current_departmentValue = data.department_id || '';
                    current_designationValue = data.designation_id || '';
                    current_typeValue = data.employee_type || '';
                    current_statusValue = data.employee_status || '';

                    // Check if inputs exist before iterating over them
                    const inputs = document.querySelectorAll('input[type="text"]');
                    if (inputs) {
                        inputs.forEach(input => {
                            if (input.name !== 'employee_id') {
                                input.removeAttribute('readonly');
                            }
                        });
                    } else {
                        console.error("Inputs are undefined or not found");
                        console.error('Additional context:', {
                            target: event.target,
                            errorDetails: error
                        });
                    }
                    
                    // Department Options
                    const departmentOptions = [
                        { text: 'Sales', value: 1 },
                        { text: 'Marketing', value: 2 },
                        { text: 'Finance', value: 3 },
                        { text: 'Human Resources', value: 4 },
                        { text: 'Information Technology', value: 5 },
                        { text: 'Operations', value: 6 },
                        { text: 'Customer Service', value: 7 },
                        { text: 'Research and Development', value: 8 },
                        { text: 'Production', value: 9 },
                        { text: 'Quality Assurance', value: 10 }
                    ]; 
                
                    // Populate designation dropdown based on selected department or add a default option
                    const selectedDepartment = current_departmentValue;
                    const designationOptions = {
                        '1': [
                            { text: 'Sales Manager', value: '1' },
                            { text: 'Sales Representative', value: '2' },
                        ],
                        '2': [
                            { text: 'Marketing Manager', value: '3' },
                            { text: 'Marketing Specialist', value: '4' },
                        ],
                        '3': [
                            { text: 'Financial Analyst', value: '5' },
                            { text: 'Accountant', value: '6' },
                        ],
                        '4': [
                            { text: 'HR Manager', value: '7' },
                            { text: 'HR Coordinator', value: '8' },
                        ],
                        '5': [
                            { text: 'IT Manager', value: '9' },
                            { text: 'IT Specialist', value: '10' },
                        ],
                        '6': [
                            { text: 'Operations Manager', value: '11' },
                            { text: 'Operations Supervisor', value: '12' },
                        ],
                        '7': [
                            { text: 'Customer Service Manager', value: '13' },
                            { text: 'Customer Service Representative', value: '14' },
                        ],
                        '8': [
                            { text: 'R&D Manager', value: '15' },
                            { text: 'Research Scientist', value: '16' },
                        ],
                        '9': [
                            { text: 'Production Manager', value: '17' },
                            { text: 'Production Worker', value: '18' },
                        ],
                        '10': [
                            { text: 'Quality Assurance Manager', value: '19' },
                            { text: 'Quality Assurance Specialist', value: '20' },
                        ],
                    };
                    
                    // Type Options
                    const typeOptions = [
                        { text: 'Regular', value: 1 },
                        { text: 'Part Time', value: 2 },
                        { text: 'Contractual', value: 3 },
                        { text: 'OJT', value: 4 },
                        { text: 'Intern', value: 5 }
                    ]; 

                    // Status Options
                    const statusOptions = [
                        { text: 'Active', value: 1 },
                        { text: 'On Leave', value: 2 },
                        { text: 'Resigned', value: 3 },
                        { text: 'Terminated', value: 4 },
                        { text: 'Retired', value: 5 }
                    ]; 

                    // Create dropdown elements
                    departmentDropdown = createDropdown(departmentOptions, designationDropdown);
                    designationDropdown = createDropdown(designationOptions[selectedDepartment] || [], null);
                    typeDropdown = createDropdown(typeOptions, null);
                    statusDropdown = createDropdown(statusOptions, null);
                                
                    // Function to create dropdown element with dependency
                    function createDropdown(options, dependentDropdown) {
                        const select = document.createElement('select');
                        options.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.textContent = option.text;
                            optionElement.value = option.value;
                            select.appendChild(optionElement);
                        });

                        // Add event listener for change event
                        select.addEventListener('change', function() {
                            if (dependentDropdown) {
                                // Clear existing options
                                dependentDropdown.innerHTML = '';

                                // Check if dependentOptions is defined and has the expected structure
                                if (dependentOptions && typeof dependentOptions === 'object' && this.value in dependentOptions) {
                                    // Get dependent options based on the selected value
                                    const selectedOptions = dependentOptions[this.value] || [];
                                    // Add new options to the dependent dropdown
                                    selectedOptions.forEach(option => {
                                        const optionElement = document.createElement('option');
                                        optionElement.textContent = option.text;
                                        optionElement.value = option.value;
                                        dependentDropdown.appendChild(optionElement);
                                    });
                                } else {
                                    console.error('Dependent options not properly initialized or invalid');
                                    // Handle the case where dependentOptions is not valid
                                }
                            }
                        });
                        return select;
                    }

                    // Event listener for department dropdown
                    departmentDropdown.addEventListener('change', () => {
                        const selectedDepartment = departmentDropdown.value;
                        const designationOptionsForDepartment = designationOptions[selectedDepartment] || [];
                        
                        // Clear existing options
                        designationDropdown.innerHTML = '';
                        
                        // Populate designation dropdown based on the selected department
                        designationOptionsForDepartment.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.textContent = option.text;
                            optionElement.value = option.value;
                            designationDropdown.appendChild(optionElement);
                        });
                    });

                    // Replace input elements with dropdown elements
                    replaceElement(departmentInput, departmentDropdown);
                    replaceElement(designationInput, designationDropdown);
                    replaceElement(typeInput, typeDropdown);
                    replaceElement(statusInput, statusDropdown);

                    // Set the dropdown values to the current values
                    departmentDropdown.value = current_departmentValue;
                    designationDropdown.value = current_designationValue;
                    typeDropdown.value = current_typeValue;
                    statusDropdown.value = current_statusValue;
                  
                } else {
                    console.error("No data received from server");
                    console.error('Additional context:', {
                        target: event.target,
                        errorDetails: error
                    });
                }
            } catch (error) {
                console.error("Error fetching assignment details:", error);
                console.error('Additional context:', {
                    target: event.target,
                    errorDetails: error
                });
            }
        };
        
        // Call fetchAssignmentDetails with the desired employee_id
        const employeeId = document.querySelector('[name="employee_id"]').value;
        fetchAssignmentDetails(employeeId);
        
        // Hide the edit and delete buttons
        deleteButton.style.display = 'none';
        editButton.style.display = 'none';
        saveButton.style.backgroundColor = '#05a95c';
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
            console.error('Additional context:', {
                target: event.target,
                errorDetails: error
            });
        }
    } else if (target.classList.contains('cancel-button-2')) {
        deleteButton.style.backgroundColor = '#c70000';
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
        const updatedEmployee = {};
        const updatedEmployeeDetails = {};
    
        const inputs = infoModal.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            if (input.name !== 'employee_id' && input.value !== 'undefined') {
                updatedEmployee[input.name] = input.value;
            }
        });
    
        updatedEmployeeDetails.designation_id = designationDropdown.value;
        updatedEmployeeDetails.employee_type = typeDropdown.value;
        updatedEmployeeDetails.employee_status = statusDropdown.value;
        updatedEmployeeDetails.designation_date = document.querySelector('input[name="designation_date"]').value;
    
        try {
            // Send employee form data to backend to update employee
            fetch(`http://localhost:3000/employee/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedEmployee)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update employee');
                }
                return response.json();
            })
            .then(data => {
                // Employee updated successfully, now update designation
                fetch(`http://localhost:3000/assign-designation/${employeeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedEmployeeDetails)
                })
                .then(response => {
                    if (response.ok) {
                        alert('Employee updated successfully');
                        closeModal();
                        fetchEmployees(); 
                    } else {
                        alert('Failed to update designation');
                    }
                })
                .catch(error => {
                    console.error('Error updating designation:', error);
                    console.error('Additional context:', {
                        target: event.target,
                        errorDetails: error
                    });
                    alert('An error occurred while updating designation');
                });
            })
            .catch(error => {
                console.error('Error updating employee:', error);
                console.error('Additional context:', {
                    target: event.target,
                    errorDetails: error
                });
                alert('An error occurred while updating employee');
            });
            
            // // Replace dropdowns with input fields
            // departmentInput = document.querySelector('input[name="department"]');
            // designationInput = document.querySelector('input[name="designation"]');
            // typeInput = document.querySelector('input[name="type"]');
            // statusInput = document.querySelector('input[name="status"]');

            // replaceElement(departmentDropdown, departmentInput);
            // replaceElement(designationDropdown, designationInput);
            // replaceElement(typeDropdown, typeInput);
            // replaceElement(statusDropdown, statusInput);
    
            // Show edit and delete buttons, hide save button and cancel button
            deleteButton.style.display = 'block';
            editButton.style.display = 'block';
            saveButton.style.display = 'none';
            cancelButton2.style.display = 'none';
                
            // Refresh the employee list
            fetchEmployees();
        } catch (error) {
          console.error('Error updating employee:', error);
          console.error('Additional context:', {
            target: event.target,
            errorDetails: error
        });
        }
    }
});

// Prevent default form submission for edit and delete buttons
infoModal.addEventListener('submit', function(event) {
    event.preventDefault();
});

// Function to replace input element with dropdown element
function replaceElement(inputElement, newElement) {
// Check if inputElement exists and has a parent node
if (!inputElement || !inputElement.parentNode) {
    return; // Exit the function if inputElement or its parent node is invalid
}

// Replace inputElement with newElement
inputElement.parentNode.replaceChild(newElement, inputElement);
}