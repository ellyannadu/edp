import { getEmployeesAndPopulateDropdown, getLeaves } from './fetchAPI.js';

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

    // Hide the dropdown initially when modal is opened
    document.getElementById('employee-dropdown').style.display = 'none';
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

// For Employee Name in modal, show employee names in dropdown
window.addEventListener('load', function() {
    getEmployeesAndPopulateDropdown();

    // Get search input and employee dropdown
    const searchInput = document.getElementById('search-input');
    const employeeDropdown = document.getElementById('employee-dropdown');

    // Function to filter dropdown options based on search input
    function filterOptions() {
        const searchText = searchInput.value.trim().toLowerCase();
        const options = employeeDropdown.getElementsByTagName('option');

        // Show dropdown when typing starts
        if (searchText.length > 0) {
            employeeDropdown.style.display = 'block';
        } else {
            employeeDropdown.style.display = 'none';
        }

        // Filter options and show by 3 rows
        let visibleOptions = 0;
        for (const option of options) {
            const optionText = option.textContent.trim().toLowerCase();
            if (optionText.includes(searchText)) {
                option.style.display = 'block'; // Show matching option
                visibleOptions++;
                if (visibleOptions > 3) {
                    option.style.display = 'none'; // Hide extra options
                }
            } else {
                option.style.display = 'none'; // Hide non-matching option
            }
        }
    }

    // Event listener for input in the search field
    searchInput.addEventListener('input', filterOptions);

    // Event listener for selecting an option in the dropdown
    employeeDropdown.addEventListener('change', function() {
        const selectedOption = employeeDropdown.options[employeeDropdown.selectedIndex];
        if (selectedOption) {
            const selectedName = selectedOption.textContent.trim();
            if (searchInput.value.trim().toLowerCase() !== selectedName.toLowerCase()) {
                searchInput.value = selectedName; // Display selected name in search input
                employeeDropdown.style.display = 'none'; // Hide the dropdown
                searchInput.focus(); // Focus back on the search input
            }
        }
    });

    // Event listener for clicking on the search input
    searchInput.addEventListener('click', function() {
        employeeDropdown.style.display = 'block'; // Show the dropdown when clicked
        filterOptions(); // Filter options based on current search input value
    });

    // Function for adding new File Leave
function fileLeave() {
    console.log('File Leave button clicked');
}
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


