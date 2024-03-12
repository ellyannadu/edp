import { closeModal, fetchEmployees } from './view_employees.js';

// function for modifying dropdown options to specific departments
document.getElementById('departmentSelect').addEventListener('change', function() {
    var designationSelect = document.getElementById('designationSelect');
  
    // Clear out the existing options
    designationSelect.innerHTML = '';
  
    if (this.value === '1') {
      // If Sales is selected, add these options to the designation dropdown
        designationSelect.innerHTML = '<option value="1">Sales Manager</option><option value="2">Sales Representative</option>';
    } 
    else if (this.value === '2') {
        designationSelect.innerHTML = '<option value="3">Marketing Manager</option><option value="4">Marketing Specialist</option>';
    } 
    else if (this.value === '3') {
        designationSelect.innerHTML = '<option value="5">Financial Analyst</option><option value="6">Accountant</option>';
    } 
    else if (this.value === '4') {
        designationSelect.innerHTML = '<option value="7">HR Manager</option><option value="8">HR Coordinator</option>';
    }
    else if (this.value === '5') {
        designationSelect.innerHTML = '<option value="9">IT Manager</option><option value="10">IT Specialist</option>';
    }
    else if (this.value === '6') {
        designationSelect.innerHTML = '<option value="11">Operations Manager</option><option value="12">Operations Supervisor</option>';
    }
    else if (this.value === '7') {
        designationSelect.innerHTML = '<option value="13">Customer Service Manager</option><option value="14">Customer Service Representative</option>';
    }
    else if (this.value === '8') {
        designationSelect.innerHTML = '<option value="15">R&D Manager</option><option value="16">Research Scientist</option>';
    }
    else if (this.value === '9') {
        designationSelect.innerHTML = '<option value="17">Production Manager</option><option value="18">Production Worker</option>';
    }
    else if (this.value === '10') {
        designationSelect.innerHTML = '<option value="19">Quality Assurance Manager</option><option value="20">Quality Assurance Specialist</option>';
    }
  });

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('employeeForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const requestData = {
            first_name: formData.get('firstname'),
            middle_name: formData.get('middlename'),
            last_name: formData.get('lastname'),
            birthdate: formData.get('birthdate'),
            contact_num: formData.get('contact'),
            email: formData.get('emailadd'),
            address_line: formData.get('address'),
            barangay: formData.get('brgy'),
            city: formData.get('city'), 
            province: formData.get('province'),
            zip_code: formData.get('zipcode'),
        };

        // Send employee form data to backend to add employee
        fetch('http://localhost:3000/employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            if (data.employee_id) {
                // Employee added successfully, now assign designation
                fetch('http://localhost:3000/assign-designation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        employee_id: data.employee_id, 
                        designation_id: formData.get('designation'),
                        employee_type: formData.get('employee-type'),
                        employee_status: formData.get('employee-status'),
                        designation_date: formData.get('designation-date')
                    })
                })
                .then(response => {
                    if (response.ok) {
                        alert('Employee added and designation assigned successfully');
                        closeModal();
                        fetchEmployees(); 
                        form.reset();
                    } else {
                        alert('Failed to assign designation');
                    }
                })
                .catch(error => {
                    console.error('Error assigning designation:', error);
                    alert('An error occurred while assigning designation');
                });
            } else {
                alert('Failed to add employee');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred, please try again later');
        });
    }); 
});
