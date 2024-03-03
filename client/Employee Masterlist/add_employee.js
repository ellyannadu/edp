import { closeModal, fetchEmployees } from './view_employees.js';

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
                        designation_id: formData.get('dropdown-des'),
                        employee_type: formData.get('dropdown-type'),
                        employee_status: formData.get('dropdown-stat'),
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

