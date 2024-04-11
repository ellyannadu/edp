const signatoryModal = document.getElementById('add-signatory-modal');
const openButton = document.getElementById('show-add-modal-button');
const closeButton = document.getElementById('close-add-modal-button');
const cancelButton = document.getElementById('cancel-add-modal-button');
const addSignatoryForm = document.getElementById('signatory-form');


const editSignatoryModal = document.getElementById('edit-signatory-modal');
const closeEditButton = document.getElementById('close-edit-modal-button');
const cancelEditButton = document.getElementById('cancel-edit-modal-button');
const editSignatoryForm = document.getElementById('edit-signatory-form');

document.addEventListener('DOMContentLoaded', function() {
    getSignatories();
    getEmployeesAndPopulateList();
    getSuperiorsAndPopulateList();
});

document.addEventListener('click', function(event) {
    const isClickedInsideDropdown = employeeListEdit.contains(event.target);
    if (!isClickedInsideDropdown) {
        hideDropdown(); // Hide dropdown if clicked outside
    }
});

// Add event listener to the button to open the dialog
openButton.addEventListener('click', function() {
  signatoryModal.showModal(); // Open the dialog
});

// Add event listener to the close button inside the dialog
closeButton.addEventListener('click', function() {
  signatoryModal.close(); // Close the dialog
});

closeEditButton.addEventListener('click', function() {
    editSignatoryModal.close();
});

// Add event listener to the cancel button inside the dialog
cancelButton.addEventListener('click', function() {
  signatoryModal.close(); 
});

cancelEditButton.addEventListener('click', function(event) {
    event.preventDefault();
    editSignatoryModal.close();
});

// Add event listener to close the dialog on outside click
window.addEventListener('click', function(event) {
    if (event.target === signatoryModal && signatoryModal.open === true) {
      signatoryModal.close(); // Close the dialog if the click target is the dialog itself
    } else if (event.target === editSignatoryModal && editSignatoryModal.open === true) {
        editSignatoryModal.close();
    }
});

// Function to get all signatories
export async function getSignatories() {
    try {
      const response = await fetch('http://localhost:3000/signatory');
      if (!response.ok) {
        throw new Error('Failed to fetch signatories');
      }
      const allSignatories = await response.json();
      displaySignatories(allSignatories);
    } catch (error) {
      console.error('Error fetching signatories:', error);
    }
  }

  export function displaySignatories(signatory) {
    const signatoryTableBody = document.getElementById('signatory-table-body');
    signatoryTableBody.innerHTML = ''; // Clear existing rows

    signatory.forEach(signatoryItem => {
        const row = document.createElement('tr');
        const statusCell = document.createElement('td');

        statusCell.textContent = signatoryItem.superior_status_name;

        // Create HTML content for each row
        row.innerHTML = `
            <td>${signatoryItem.signatory_id}</td>
            <td>${signatoryItem.signatory_first_name} ${signatoryItem.signatory_last_name}</td>
            <td>${signatoryItem.superior_first_name} ${signatoryItem.superior_last_name}</td>
        `;

        row.appendChild(statusCell);
        row.appendChild(createEditButton(signatoryItem)); // Append edit button to row
        signatoryTableBody.appendChild(row);
    });
}

function createEditButton(signatoryItem) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    // console.log('signatoryItem', signatoryItem);   

    editButton.addEventListener('click', function() {
        editSignatoryModal.showModal();
        editSignatoryForm.elements['signatory-id'].value = signatoryItem.signatory_id;
        editSignatoryForm.elements['employee-id'].value = signatoryItem.signatory_employee_id;
        editSignatoryForm.elements['edit-search-input'].value = `${signatoryItem.signatory_last_name}, ${signatoryItem.signatory_first_name} ${signatoryItem.signatory_middle_name}`;
        editSignatoryForm.elements['edit-superior-search-input'].value = `${signatoryItem.superior_last_name}, ${signatoryItem.superior_first_name} ${signatoryItem.superior_middle_name}`;
        editSignatoryForm.elements['superior-id'].value = signatoryItem.superior_id;
        
        
        editSignatoryForm.elements['superior-status-select'].value = signatoryItem.superior_status;
        getEmployeesAndPopulateList();
    });
    return editButton;
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

export async function submitSignatory(requestData) {
    try {
      const response = await fetch('http://localhost:3000/signatory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit signatory');
      }
  
      const data = await response.json(); // Parse response as JSON
      console.log('Signatory submitted successfully:', data);
      getSignatories();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred, please try again later');
    }
  }

// Submit signatory on add signatory button
addSignatoryForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // Get form data
    const formData = new FormData(addSignatoryForm);

    const requestData = {
        employee_id: formData.get('employee-id'),
        superior_id: formData.get('superior-id'),
        superior_status: formData.get('superior-status'),
    };
    submitSignatory(requestData);
    signatoryModal.close();
}); 

// Function to hide the dropdown
function hideDropdown() {
    employeeListEdit.classList.remove('show-dropdown');
    employeeListAdd.classList.remove('show-dropdown');
}

const superiorIdInputAdd = document.querySelector('#superior-id');
const superiorListAdd = document.querySelector('.superior-list-dropdown');
const superiorNameInput = document.querySelector('#superior-search-input');

superiorListAdd.addEventListener('click', function(event) {
    const clickedItem = event.target.closest('.superior-list-item');
    if (clickedItem) {
        const superiorId = clickedItem.dataset.value;
        const superiorName = clickedItem.textContent.trim();
        if (superiorIdInputAdd) {
            console.log('clicked ID in add modal: ', superiorId);
            superiorIdInputAdd.value = superiorId; // Update superior ID input in add modal
            superiorNameInput.value = superiorName; // Update superior name input in add modal
            hideDropdown();
        }
    }
});

// Fetch all employees + populate dropdown
export async function getEmployeesAndPopulateList() {
    try {
      const response = await fetch('http://localhost:3000/employee');
      if (!response.ok) {
          throw new Error('Failed to fetch employees');
      }
      const allEmployees = await response.json();
  
      const employeeLists = document.querySelectorAll('.employee-list');
      employeeLists.forEach(employeeList => {
          employeeList.innerHTML = ''; // Clear existing content
          allEmployees.forEach(employee => {
              const listItem = document.createElement('div');
              listItem.classList.add('employee-list-item');
              listItem.textContent = `${employee.last_name}, ${employee.first_name} ${employee.middle_name}`;
              listItem.dataset.value = employee.employee_id;
              employeeList.appendChild(listItem);
          });
      });
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
  }

  
  export async function getSuperiorsAndPopulateList() {
    try {
      const response = await fetch('http://localhost:3000/employee');
      if (!response.ok) {
          throw new Error('Failed to fetch superiors');
      }
      const allSuperiors = await response.json();
  
      const superiorLists = document.querySelectorAll('.superior-list');
      superiorLists.forEach(superiorList => {
          superiorList.innerHTML = ''; // Clear existing content
          allSuperiors.forEach(superior => {
              const listItem = document.createElement('div');
              listItem.classList.add('superior-list-item');
              listItem.textContent = `${superior.last_name}, ${superior.first_name} ${superior.middle_name}`;
              listItem.dataset.value = superior.employee_id;
              superiorList.appendChild(listItem);
          });
      });
    } catch (error) {
        console.error('Error fetching superiors:', error);
    }
  }
  

// Event listener for employee list items in the add modal
const employeeIdInputEdit = document.querySelector('#employee-id-edit');
const employeeListEdit = document.querySelector('.employee-list-dropdown-edit');
const employeeNameInputEdit = document.querySelector('#edit-search-input');

employeeListEdit.addEventListener('click', function(event) {
    const clickedItem = event.target.closest('.employee-list-item');
    if (clickedItem) {
        const employeeId = clickedItem.dataset.value;
        const employeeNameEdit = clickedItem.textContent.trim();
        if (employeeIdInputEdit) {
            console.log('clicked ID in add modal: ', employeeId);
            employeeIdInputEdit.value = employeeId; // Update employee ID input in add modal
            employeeNameInputEdit.value = employeeNameEdit; // Update employee name input in add modal
            hideDropdown();
        }
    }
});

const superiorIdInputEdit = document.querySelector('#superior-id-edit');
const superiorListEdit = document.querySelector('.superior-list-dropdown-edit');
const superiorNameInputEdit = document.querySelector('#edit-superior-search-input');

superiorListEdit.addEventListener('click', function(event) {
    const clickedItem = event.target.closest('.superior-list-item');
    if (clickedItem) {
        const superiorId = clickedItem.dataset.value;
        const superiorNameEdit = clickedItem.textContent.trim();
        if (superiorIdInputEdit) {
            console.log('clicked ID in add modal: ', superiorId);
            superiorIdInputEdit.value = superiorId; // Update superior ID input in add modal
            superiorNameInputEdit.value = superiorNameEdit; // Update superior name input in add modal
            hideDropdown();
        }
    }
});

// Edit signatories when submitting
editSignatoryForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(editSignatoryForm);

    const requestedData = {
        signatory_id: formData.get('signatory-id'),
        employee_id: formData.get('employee-id'),
        superior_id: formData.get('superior-id'),
        superior_status: formData.get('superior-status'),
    };

    try {
        updateSignatory(requestedData);
        editSignatoryModal.close();
    } catch (error) {
        console.error('Error updating signatories:', error);
    }
});

// Function to update a signatory of a specific ID
export async function updateSignatory(requestedData) {
    try {
      console.log('emp ID:', requestedData.employee_id);
      const response = await fetch(`http://localhost:3000/signatory/${requestedData.signatory_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestedData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to update signatory');
      }
  
      const data = await response.json(); 
      console.log('Signatory updated successfully:', requestedData);
      getSignatories();
    } catch(error) {
      console.error('Error:', error);
      alert('An error occurred, please try again later');
    }
  }
  
