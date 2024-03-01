document.addEventListener('DOMContentLoaded', function() {
    // Function to open update_employees.html
    function openUpdatePage() {
        window.open('/client/update employees/update_employees.html', '_blank');
    }

    // Open update_employees.html on edit-button click
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-button')) {
            openUpdatePage();
        }
    });

    // Delete employee on delete-button click
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            deleteEmployee(event);
        }
    });
    
    // Open add_employees.html on add-button click
    document.getElementById('add-button').addEventListener('click', function() {
        window.open('/client/add employees/add_employees.html', '_blank');
    });

    // Fetch and display employees
    fetchEmployees();

});

async function fetchEmployees() {
    try {
        const response = await fetch('http://localhost:3000/employee');
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

function displayEmployees(employees) {
    const employeeTableBody = document.getElementById('employee-table-body');
    employeeTableBody.innerHTML = ''; // Clear existing rows

    employees.forEach(employee => {
        const row = document.createElement('tr');
        const birthdate = employee.birthdate.split('T')[0];
        row.innerHTML = `
            <td>${employee.employee_id}</td>
            <td>${employee.first_name}</td>
            <td>${employee.middle_name}</td>
            <td>${employee.last_name}</td>
            <td>${birthdate}</td>
            <td>${employee.contact_num}</td>
            <td>${employee.email}</td>
            <td>${employee.address_line}</td>
            <td>${employee.barangay}</td>
            <td>${employee.city}</td>
            <td>${employee.province}</td>
            <td>${employee.zip_code}</td>
            <td>
                <button class="edit-button"> 
                    <i class="fas fa-edit"></i> 
                </button>

                <button class="delete-button"> 
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        employeeTableBody.appendChild(row);
    });
}


async function deleteEmployee(event){
    console.log('Delete button clicked');

    const button = event.target;
    const row = button.closest('tr');
    const employee_id = row.children[0].innerText;

    try{
        await fetch(`http://localhost:3000/employee/${employee_id}`, {
            method: 'DELETE'
        });
        row.remove();

        fetchEmployees();
    }catch(error){
        console.error('Error deleting employee:', error);
    }
}