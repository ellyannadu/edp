import { submitLeaveRequest, getEmployeesAndPopulateList, getLeaves, updateLeaveRequest } from './fetchAPI.js';

const addLeaveModal = document.getElementById('add-leave-modal');
const editLeaveModal = document.getElementById('edit-leave-modal');
const showAddModalButton = document.getElementById('show-add-modal-button');
const closeAddModalButton = document.getElementById('close-add-modal-button');
const closeEditModalButton = document.getElementById('close-edit-modal-button');
const cancelAddModalButton = document.getElementById('cancel-add-modal-button');
const cancelEditModalButton = document.getElementById('cancel-edit-modal-button');
const addLeaveForm = document.getElementById('file-leave-form');
const editLeaveForm = document.getElementById('edit-leave-form');
const searchInput = document.getElementById('search-input');
const employeeList = document.getElementById('employee-list');
const employeeIDInput = document.getElementById('employee-id');

// Fetch all leave on page load
document.addEventListener('DOMContentLoaded', function() {
    getLeaves();
});

// Show add leave request modal
showAddModalButton.addEventListener('click', function() {
    addLeaveForm.reset();
    addLeaveModal.showModal();
});

// Close modal on close button
closeAddModalButton.addEventListener('click', function() {
    addLeaveModal.close();
});

closeEditModalButton.addEventListener('click', function() {
    editLeaveModal.close();
});

// Close modal on cancel
cancelAddModalButton.addEventListener('click', function(event) {
    event.preventDefault();
    addLeaveModal.close();
});

cancelEditModalButton.addEventListener('click', function(event) {
    event.preventDefault();
    editLeaveModal.close();
});

// Close modal on outside click
window.addEventListener('click', function(event) {
    if (event.target === addLeaveModal && addLeaveModal.open === true) {
        addLeaveModal.close();
    } else if (event.target === editLeaveModal && editLeaveModal.open === true) {
        editLeaveModal.close();
    }
});

// Function to display leave list in table format
export function displayLeave(leave) {
    const leaveTableBody = document.getElementById('leave-table-body');
    leaveTableBody.innerHTML = ''; // Clear existing rows

    leave.forEach(leaveItem => {
        const row = document.createElement('tr');
        const statusCell = document.createElement('td');

        // Apply leave status color and style classes based on status name
        switch (leaveItem.leave_status_name.toLowerCase()) {
            case 'pending':
                statusCell.classList.add('pending-status');
                break;
            case 'approved':
                statusCell.classList.add('approved-status');
                break;
            case 'denied':
                statusCell.classList.add('denied-status');
                break;
            default:
                break;
        }

        statusCell.textContent = leaveItem.leave_status_name;

        row.innerHTML = `
            <td>${leaveItem.leave_id}</td>
            <td>${leaveItem.first_name} ${leaveItem.last_name}</td>
            <td>${leaveItem.leave_start.split('T')[0]}</td>
            <td>${leaveItem.leave_end.split('T')[0]}</td>
            <td>${leaveItem.leave_type_name}</td>
        `;
        row.appendChild(statusCell);
        row.appendChild(createEditButton(leaveItem));
        leaveTableBody.appendChild(row);
    });
}

// Function to create edit button and attach event listener
function createEditButton(leaveItem) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    console.log('leaveItem', leaveItem);   

    editButton.addEventListener('click', function() {
        editLeaveModal.showModal();
        editLeaveForm.elements['leave-id'].value = leaveItem.leave_id;
        editLeaveForm.elements['employee-id'].value = leaveItem.employee_id;
        editLeaveForm.elements['search-input'].value = `${leaveItem.last_name}, ${leaveItem.first_name} ${leaveItem.middle_name}`;
        editLeaveForm.elements['leave-start'].value = leaveItem.leave_start.split('T')[0];
        editLeaveForm.elements['leave-end'].value = leaveItem.leave_end.split('T')[0];
        editLeaveForm.elements['leave-type-select'].value = leaveItem.leave_type;
        editLeaveForm.elements['leave-status-select'].value = leaveItem.leave_status;
    });
    return editButton;
}

// Fetch all employees + populate dropdown
window.addEventListener('load', function() {
    getEmployeesAndPopulateList();

    employeeList.addEventListener('click', function(event) {
        const selectedItem = event.target.closest('.employee-list-item');
        if (selectedItem) {
            const selectedName = selectedItem.textContent.trim();
            const selectedValue = selectedItem.dataset.value;
            searchInput.value = selectedName;
            employeeIDInput.value = selectedValue;
            console.log('Selected Name ID:', selectedValue); // Log the selected name
            employeeList.style.display = 'none';
            searchInput.focus();
        }
    });
});

// Filter employee list based on search input
function filterList() {
    const searchText = searchInput.value.trim().toLowerCase();
    const listItems = employeeList.getElementsByClassName('employee-list-item');

    // Show list when typing starts
    if (searchText.length > 0) {
        employeeList.style.display = 'block';
        employeeIDInput.value = ''; // Clear employee ID
    } else {
        employeeList.style.display = 'none';
    }

    // Filter list items based on search text
    for (const item of listItems) {
        const itemName = item.textContent.trim().toLowerCase();
        if (itemName.includes(searchText)) {
            item.style.display = 'block'; // Show matching item
        } else {
            item.style.display = 'none'; // Hide non-matching item
        }
    }
}

searchInput.addEventListener('input', filterList);

searchInput.addEventListener('click', function() {
    employeeList.style.display = 'block';
    filterList();
});

// Submit leave request on file leave button
addLeaveForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // Get form data
    const formData = new FormData(addLeaveForm);

    // Adjust dates for timezone offset
    const leaveStartInput = formData.get('leave-start');
    const leaveEndInput = formData.get('leave-end');
    console.log("leaveStartInput", leaveStartInput);
    console.log("leaveEndInput", leaveEndInput);
    // Manually parse date strings and construct UTC date objects
    const [startYear, startMonth, startDay] = leaveStartInput.split('-').map(Number);
    const [endYear, endMonth, endDay] = leaveEndInput.split('-').map(Number);
    const leaveStart = new Date(Date.UTC(startYear, startMonth - 1, startDay)); // Note: Month is zero-based in JavaScript
    const leaveEnd = new Date(Date.UTC(endYear, endMonth - 1, endDay)); // Note: Month is zero-based in JavaScript

    leaveStart.setDate(leaveStart.getDate() + 1);
    leaveEnd.setDate(leaveEnd.getDate() + 1);

    const requestData = {
        employee_id: formData.get('employee-id'),
        leave_start: leaveStart.toISOString(),         
        leave_end: leaveEnd.toISOString(),
        leave_type: formData.get('leave-type'),
        leave_status: formData.get('leave-status'),
    };

    console.log('Form Data 1:', requestData);
    submitLeaveRequest(requestData);
    addLeaveModal.close();
    getLeaves(); 
    addLeaveForm.reset();
}); 

// Edit/Update Leave Request on form submit
editLeaveForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(editLeaveForm);
    const leave_id = formData.get('leave-id');
    const leaveStart = new Date(formData.get('leave-start'));
    const leaveEnd = new Date(formData.get('leave-end'));
    leaveStart.setDate(leaveStart.getDate() + 1);
    leaveEnd.setDate(leaveEnd.getDate() + 1);

    const requestedData = {
        employee_id: formData.get('employee-id'),
        leave_start: leaveStart.toISOString(),
        leave_end: leaveEnd.toISOString(),
        leave_type: formData.get('leave-type'),
        leave_status: formData.get('leave-status'),
    };

    try {
        updateLeaveRequest(requestedData, leave_id);
        editLeaveModal.close();
    } catch (error) {
        console.error('Error updating leave:', error);
    }
});
