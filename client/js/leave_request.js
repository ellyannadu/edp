// to fix: update employee name [di magwork], search sa add modal
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

// Fetch all leave on page load
document.addEventListener('DOMContentLoaded', function() {
    getLeaves();
    getEmployeesAndPopulateList();
});

document.addEventListener('click', function(event) {
    const isClickedInsideDropdown = employeeListEdit.contains(event.target);
    if (!isClickedInsideDropdown) {
        hideDropdown(); // Hide dropdown if clicked outside
    }
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

        const leave_Start = new Date(leaveItem.leave_start);
        const leave_End = new Date(leaveItem.leave_end);
        leave_Start.setDate(leave_Start.getDate() + 1);
        leave_End.setDate(leave_End.getDate() + 1);

        row.innerHTML = `
            <td>${leaveItem.leave_id}</td>
            <td>${leaveItem.first_name} ${leaveItem.last_name}</td>
            <td>${leave_Start.toISOString().split('T')[0]}</td>
            <td>${leave_End.toISOString().split('T')[0]}</td>
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
    // console.log('leaveItem', leaveItem);   

    editButton.addEventListener('click', function() {
        editLeaveModal.showModal();
        editLeaveForm.elements['leave-id'].value = leaveItem.leave_id;
        editLeaveForm.elements['employee-id'].value = leaveItem.employee_id;
        editLeaveForm.elements['edit-search-input'].value = `${leaveItem.last_name}, ${leaveItem.first_name} ${leaveItem.middle_name}`;
        editLeaveForm.elements['leave-start'].value = leaveItem.leave_start.split('T')[0];
        editLeaveForm.elements['leave-end'].value = leaveItem.leave_end.split('T')[0];
        editLeaveForm.elements['leave-type-select'].value = leaveItem.leave_type;
        editLeaveForm.elements['leave-status-select'].value = leaveItem.leave_status;
        getEmployeesAndPopulateList();
    });
    return editButton;
}

// Function to hide the dropdown
function hideDropdown() {
    employeeListEdit.classList.remove('show-dropdown');
    employeeListAdd.classList.remove('show-dropdown');
}

// Event listener for employee list items in the add modal
const employeeIdInputAdd = document.querySelector('#employee-id');
const employeeListAdd = document.querySelector('.employee-list-dropdown');
const employeeNameInput = document.querySelector('#search-input');

employeeListAdd.addEventListener('click', function(event) {
    const clickedItem = event.target.closest('.employee-list-item');
    if (clickedItem) {
        const employeeId = clickedItem.dataset.value;
        const employeeName = clickedItem.textContent.trim();
        if (employeeIdInputAdd) {
            console.log('clicked ID in add modal: ', employeeId);
            employeeIdInputAdd.value = employeeId; // Update employee ID input in add modal
            employeeNameInput.value = employeeName; // Update employee name input in add modal
            hideDropdown();
        }
    }
});

// Event listener for employee list items in the edit modal
const employeeIdInputEdit = document.querySelector('#employee-id-edit');
const employeeListEdit = document.querySelector('.employee-list-dropdown-edit');
const employeeNameInputEdit = document.querySelector('#edit-search-input');

employeeListEdit.addEventListener('click', function(event) {
    const clickedItem = event.target.closest('.employee-list-item');
    if (clickedItem) {
        const employeeId = clickedItem.dataset.value;
        const employeeNameEdit = clickedItem.textContent.trim();
        if (employeeIdInputEdit) {
            console.log('clicked ID in edit modal: ', employeeId);
            employeeIdInputEdit.value = employeeId; // Update employee ID input in edit modal
            employeeNameInputEdit.value = employeeNameEdit; // Update employee name input in edit modal
            hideDropdown();
        }
    }
});

// Submit leave request on file leave button
addLeaveForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // Get form data
    const formData = new FormData(addLeaveForm);

    const requestData = {
        employee_id: formData.get('employee-id'),
        leave_start: formData.get('leave-start').split('T')[0],         
        leave_end: formData.get('leave-end').split('T')[0],
        leave_type: formData.get('leave-type'),
        leave_status: formData.get('leave-status'),
    };
    submitLeaveRequest(requestData);
    addLeaveModal.close();
}); 

// Edit/Update Leave Request on form submit
editLeaveForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(editLeaveForm);

    const requestedData = {
        employee_id: formData.get('employee-id'),
        leave_id: formData.get('leave-id'),
        leave_start: formData.get('leave-start').split('T')[0],         
        leave_end: formData.get('leave-end').split('T')[0],
        leave_type: formData.get('leave-type'),
        leave_status: formData.get('leave-status'),
    };

    try {
        updateLeaveRequest(requestedData);
        editLeaveModal.close();
    } catch (error) {
        console.error('Error updating leave:', error);
    }
});

