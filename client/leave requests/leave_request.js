import { getLeaves } from './fetchAPI.js';

const leaveModal = document.getElementById('leave-modal');
const showModalButton = document.getElementById('show-modal-button');
const closeModalButton = document.getElementById('close-modal-button');
const cancelButton = document.getElementById('cancel-modal-button');

document.addEventListener('DOMContentLoaded', function() {
    getLeaves();
});

// Show and hide modal
showModalButton.addEventListener('click', function() {
    leaveModal.showModal();
});

closeModalButton.addEventListener('click', function() {
    leaveModal.close();
});

cancelButton.addEventListener('click', function(event) {
    event.preventDefault();
    leaveModal.close();
});

window.addEventListener('click', function(event) {
    if (event.target === leaveModal) {
        leaveModal.close();
    }
});

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