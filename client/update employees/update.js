document.addEventListener('DOMContentLoaded', function() {
    // Function to open update_employees.html
    function openUpdatePage(employeeData) {
        // Open the update page and pass employeeData as a query parameter
        const queryParams = new URLSearchParams();
        for (const key in employeeData) {
            queryParams.append(key, employeeData[key]);
        }
        const queryString = queryParams.toString();
        window.open(`/client/update employees/update_employees.html?${queryString}`, '_blank');
    }

    // Attach event listener to edit buttons
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Edit button clicked');
            // Get the corresponding row
            const row = button.closest('tr');
            
            // Extract data from the row
            const employeeData = {
                employee_id: row.querySelector('td:nth-child(1)').textContent,
                first_name: row.querySelector('td:nth-child(2)').textContent,
                middle_name: row.querySelector('td:nth-child(3)').textContent,
                last_name: row.querySelector('td:nth-child(4)').textContent,
                birthdate: row.querySelector('td:nth-child(5)').textContent,
                contact_num: row.querySelector('td:nth-child(6)').textContent,
                email: row.querySelector('td:nth-child(7)').textContent,
                address_line: row.querySelector('td:nth-child(8)').textContent,
                barangay: row.querySelector('td:nth-child(9)').textContent,
                city: row.querySelector('td:nth-child(10)').textContent,
                province: row.querySelector('td:nth-child(11)').textContent,
                zip_code: row.querySelector('td:nth-child(12)').textContent
            };

            // Open the update page and pass employeeData
            openUpdatePage(employeeData);
        });
    });

     // Exit add employee page
     const cancelButton = document.getElementById('cancel-button');
     cancelButton.addEventListener('click', function() {
         window.location.href = "/client/view employees/view_employees.html";
     });
});
