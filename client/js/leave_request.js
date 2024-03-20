import {     getEmployeesAndPopulateList, getLeaves } from './fetchAPI.js';

const leaveModal = document.getElementById('leave-modal');
const showModalButton = document.getElementById('show-modal-button');
const closeModalButton = document.getElementById('close-modal-button');
const cancelButton = document.getElementById('cancel-modal-button');

// Fetch all leave on page load
document.addEventListener('DOMContentLoaded', function() {
    getLeaves();
});

// Show modal
showModalButton.addEventListener('click', function() {
    leaveModal.showModal();
});

// Close modal
closeModalButton.addEventListener('click', function() {
    leaveModal.close();
});

// Close modal on cancel
cancelButton.addEventListener('click', function(event) {
    event.preventDefault();
    leaveModal.close();
});

// Close modal on outside click
window.addEventListener('click', function(event) {
    if (event.target === leaveModal) {
        leaveModal.close();
    }
});

// Submit leave request on file leave button
cancelButton.addEventListener('click', function(event) {
    event.preventDefault();
    leaveModal.close();
});

// Function to display leave list in table format
export function displayLeave(leave) {
    const leaveTableBody = document.getElementById('leave-table-body');
    leaveTableBody.innerHTML = ''; // Clear existing rows

    leave.forEach(leaveItem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${leaveItem.first_name} ${leaveItem.last_name}</td>
            <td>${leaveItem.leave_start.split('T')[0]}</td>
            <td>${leaveItem.leave_end.split('T')[0]}</td>
            <td>${leaveItem.leave_type_name}</td>
            <td>${leaveItem.leave_status_name}</td>
        `;
        leaveTableBody.appendChild(row);
    });
}

// Fetch all employees + populate dropdown
window.addEventListener('load', function() {
    getEmployeesAndPopulateList();

    const searchInput = document.getElementById('search-input');
    const employeeList = document.getElementById('employee-list');

    function filterList() {
        const searchText = searchInput.value.trim().toLowerCase();
        const listItems = employeeList.getElementsByClassName('employee-list-item');

        // Show list when typing starts
        if (searchText.length > 0) {
            employeeList.style.display = 'block';
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

    employeeList.addEventListener('click', function(event) {
        const selectedItem = event.target.closest('.employee-list-item');
        if (selectedItem) {
            const selectedName = selectedItem.textContent.trim();
            const selectedValue = selectedItem.dataset.value;
            searchInput.value = selectedName;
            console.log('Selected Name ID:', selectedValue); // Log the selected name
            employeeList.style.display = 'none';
            searchInput.focus();
        }
    });

    searchInput.addEventListener('click', function() {
        employeeList.style.display = 'block';
        filterList();
    });
});
