// View all employees in table form
// Fetch employee details from the server
// Open info modal on info-button click
// Display employee details in the info modal
// Open add modal on add-button click
// Close modals on close-button click
// Close modals when clicking outside

// Function to display all employees
var employeeTableBody = document.getElementById('employee-table-body');
export function displayEmployees(employees) {
  employeeTableBody.innerHTML = ''; // Clear existing rows

  employees.forEach(employee => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${employee.employee_id}</td>
        <td>${employee.last_name}</td>
        <td>${employee.first_name}</td>
        <td>${employee.middle_name}</td>
        <td>
            <button class="modalBtn" data-employee_id="${employee.employee_id}">
                <i class="fa-solid fa-circle-info"></i>
            </button>
        </td>
    `;
    employeeTableBody.appendChild(row);
  });
}
// Function to fetch all employees
export async function fetchEmployees() {
  try {
    const response = await fetch('http://localhost:3000/employee');
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    const employees = await response.json();
    displayEmployees(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
}

// Function to close the modals
  export function closeModal() {
    infoModal.style.display = 'none';
    addModal.style.display = 'none';
  }

document.addEventListener('DOMContentLoaded', function() {
  var addModal = document.getElementById('addModal');
  var infoModal = document.getElementById('infoModal');
  var infoCloseButton = infoModal.querySelector('.close');
  var addCloseButton = addModal.querySelector('.close');
  var cancelButton = addModal.querySelector('#cancel-button');
  var addButton = document.getElementById('addButton');

  // Function to open the info modal and populate employee information
  function openInfoModal(employeeInfo) {
    var modalBody = infoModal.querySelector('.modal-body');
    modalBody.innerHTML = `
        ${employeeInfo}
    `;
    infoModal.style.display = 'block';
    saveButton.style.display = 'none';
    cancelButton2.style.display = 'none';
  }

  // Event listener for the close buttons
  infoCloseButton.addEventListener('click', function() {
    closeModal();
  });

  addCloseButton.addEventListener('click', function() {
    closeModal();
  });

  cancelButton.addEventListener('click', function() {
    closeModal();
  });

  // Event listener to close the modals when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === infoModal || event.target === addModal) {
      closeModal();
    }
  });

  // Event listener for the add button to open the add modal
  addButton.addEventListener('click', function() {
    addModal.style.display = 'block';
  });

  // Event listener for dynamically created info buttons
  employeeTableBody.addEventListener('click', async function(event) {
    if (event.target.classList.contains('modalBtn')) {
      var employee_id = event.target.dataset.employee_id;
      try {
        var employeeDetails = await fetchEmployeeDetails(employee_id);
        openInfoModal(employeeDetails);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    }
  });

  // Function to fetch employee details from the server
  async function fetchEmployeeDetails(employee_id) {
    try {
      const response = await fetch(`http://localhost:3000/employee/${employee_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee details');
      }
      const employeeDetails = await response.json();
      return formatEmployeeDetails(employeeDetails);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      throw error;
    }
  }

  // Function to format employee details
  function formatEmployeeDetails(employeeDetails) {
    var formattedDetails = `
      <section class="container">
        <form id="employeeForm" class="form" readonly>

          <div class="row">
            <div class="column">
              <div class="input--box">
                <label>Employee ID</label>
                <input type="text" name="employee_id" value="${employeeDetails.employee_id}" readonly />
              </div>
            </div>

            <div class="column">
              <div class="input--box">
                <label>First Name</label>
                <input type="text" name="first_name" value="${employeeDetails.first_name}" readonly />
              </div>
            </div>

            <div class="column">
                <div class="input--box">
                  <label>Middle Name</label>
                  <input type="text" name="middle_name" value="${employeeDetails.middle_name}" readonly />
                </div>
            </div>

            <div class="column">
              <div class="input--box">
                <label>Last Name</label>
                <input type="text" name="last_name" value="${employeeDetails.last_name}" readonly />
              </div>
            </div>
          </div>

          <div class="row">
          <div class="column">
            <div class="input--box">
              <label>Birthdate</label>
              <input type="text" name="birthdate" value="${employeeDetails.birthdate.split('T')[0]}" readonly />
            </div>
          </div>

          <div class="column">
            <div class="input--box">
              <label>Contact Number</label>
              <input type="text" name="contact_num" value="${employeeDetails.contact_num}" readonly />
            </div>
          </div>

          <div class="column">
            <div class="input--box">
              <label>Email Address</label>
              <input type="text" name="email" value="${employeeDetails.email}" readonly />
            </div>
          </div>
          </div>

          <div class="input--box">
            <label>Address</label>
            <input type="text" name="address_line" value="${employeeDetails.address_line}" readonly />

          <div class="row">
            <div class="column">
              <div class="input--box">
                <label>Barangay</label>
                <input type="text" name="barangay" value="${employeeDetails.barangay}" readonly />
              </div>
            </div>

            <div class="column">
              <div class="input--box">
                <label>City</label>
                <input type="text" name="city" value="${employeeDetails.city}" readonly />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="column">
              <div class="input--box">
                <label>Province</label>
                <input type="text" name="province" value="${employeeDetails.province}" readonly />
              </div>
            </div>

            <div class="column">
              <div class="input--box">
                <label>Zip Code</label>
                <input type="text" name="zip_code" value="${employeeDetails.zip_code}" readonly />
              </div>
            </div>
          </div>
          </div>

          <div class="row">
           <div class="column">
            <div class="input--box">
              <label>Department</label>
              <input type="text" name="department" value="${employeeDetails.department}" readonly />
            </div>
          </div>

          <div class="column">
            <div class="input--box">
              <label>Designation</label>
              <input type="text" name="designation" value="${employeeDetails.assign_designation}" readonly />
            </div>
          </div>

          <div class="column">
          <div class="input--box">
            <label>Designation Date</label>
            <input type="text" name="designation_date" value="${employeeDetails.designation_date}" readonly />
          </div>
          </div>
          </div>

          <div class="row">
            <div class="column">
                <div class="input--box">
                  <label>Employee Type</label>
                  <input type="text" name="type" value="${employeeDetails.type}" readonly />
                </div>
            </div>

            <div class="column">
              <div class="input--box">
                <label>Employment Status</label>
                <input type="text" name="status" value="${employeeDetails.employee_status}" readonly />
              </div>
            </div>
          </div>
        
          <div class="row">
            <button id="editButton" class="edit-button">Edit</button>
            <button id="deleteButton" class="delete-button">Delete Employee</button>
            <button id="saveButton" class="save-button">Save</button>
            <button id="cancelButton2" class="cancel-button-2">Cancel</button>
          </div>    
        </form>
      </section>
    `;
    return formattedDetails;
  }

  // Fetch and display all employees when the page is loaded
  fetchEmployees();
});
