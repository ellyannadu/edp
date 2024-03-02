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