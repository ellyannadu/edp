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
        <td>${employee.department_name}</td>
        <td>${employee.designation_name}</td>
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
    const response = await fetch('http://localhost:3000/employees');
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
    deleteButton.style.backgroundColor = '#c70000';
  }

  // Event listener for the close buttons
  infoCloseButton.addEventListener('click', function() {
    closeModal();
  });

  addCloseButton.addEventListener('click', function() {
    closeModal();
  });

  cancelButton.addEventListener('click', function(event) {
    event.preventDefault();
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
      const employeeResponse = await fetch(`http://localhost:3000/employee/${employee_id}`);
      if (!employeeResponse.ok) {
        throw new Error('Failed to fetch employee details');
      }
      const employeeDetails = await employeeResponse.json();
      
      // Fetch employee designation separately
      const designationResponse = await fetch(`http://localhost:3000/assign-designation/${employee_id}`);
      if (!designationResponse.ok) {
        throw new Error('Failed to fetch employee designation');
      }
      
      const employeeDesignation = await designationResponse.json();
      
      // Call formatEmployeeDetails with employee details and designation
      const formattedDetails = formatEmployeeDetails({ employeeDetails, employeeDesignation });
      console.log(employeeDesignation);
      return formattedDetails;
    } catch (error) {
      console.error('Error fetching employee details:', error);
      throw error;
    }
  }

  // Function to format employee details
  function formatEmployeeDetails({ employeeDetails, employeeDesignation }) {
    var formattedDetails = `
      <section class="container">
        <form id="employeeForm" class="form" readonly>

          <div class="row">
            <div class="column">
              <div class="input--box">
                <label>Employee ID</label>
                <input type="text" name="employee_id" class="info-modal-input" value="${employeeDetails.employee_id}" readonly />
              </div>
            </div>

            <div class="column">
              <div class="input--box">
                <label>First Name</label>
                <input type="text" name="first_name" class="info-modal-input" value="${employeeDetails.first_name}" readonly />
              </div>
            </div>

            <div class="column">
                <div class="input--box">
                  <label>Middle Name</label>
                  <input type="text" name="middle_name" class="info-modal-input" value="${employeeDetails.middle_name}" readonly />
                </div>
            </div>

            <div class="column">
              <div class="input--box">
                <label>Last Name</label>
                <input type="text" name="last_name" class="info-modal-input" value="${employeeDetails.last_name}" readonly />
              </div>
            </div>
          </div>

          <div class="row">
          <div class="column">
            <div class="input--box">
              <label>Birthdate</label>
              <input type="text" name="birthdate" class="info-modal-input" value="${employeeDetails.birthdate.split('T')[0]}" readonly />
            </div>
          </div>

          <div class="column">
            <div class="input--box">
              <label>Contact Number</label>
              <input type="text" name="contact_num" class="info-modal-input" value="${employeeDetails.contact_num}" readonly />
            </div>
          </div>

          <div class="column">
            <div class="input--box">
              <label>Email Address</label>
              <input type="text" name="email" class="info-modal-input" value="${employeeDetails.email}" readonly />
            </div>
          </div>
          </div>

          <div class="input--box">
            <label>Address</label>
            <input type="text" name="address_line" class="info-modal-input" value="${employeeDetails.address_line}" readonly />

          <div class="row">
            <div class="column">
              <div class="input--box">
                <label>Barangay</label>
                <input type="text" name="barangay" class="info-modal-input" value="${employeeDetails.barangay}" readonly />
              </div>
            </div>

            <div class="column">
              <div class="input--box">
                <label>City</label>
                <input type="text" name="city" class="info-modal-input" value="${employeeDetails.city}" readonly />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="column">
              <div class="input--box">
                <label>Province</label>
                <input type="text" name="province" class="info-modal-input" value="${employeeDetails.province}" readonly />
              </div>
            </div>

            <div class="column">
              <div class="input--box">
                <label>Zip Code</label>
                <input type="text" name="zip_code" class="info-modal-input" value="${employeeDetails.zip_code}" readonly />
              </div>
            </div>
          </div>
          </div>

          <div class="row">
           <div class="column">
            <div class="input--box">
              <label>Department</label>
              <input type="text" name="department" class="info-modal-input" value="${employeeDesignation.department_name}" readonly />
            </div>
          </div>

          <div class="column">
            <div class="input--box">
              <label>Designation</label>
              <input type="text" name="designation" class="info-modal-input" value="${employeeDesignation.designation_name}" readonly />
            </div>
          </div>

          <div class="column">
          <div class="input--box">
            <label>Designation Date</label>
            <input type="text" name="designation_date" class="info-modal-input" value="${employeeDesignation.designation_date.split('T')[0]}" readonly />
          </div>
          </div>
          </div>

          <div class="row">
            <div class="column">
                <div class="input--box">
                  <label>Employee Type</label>
                  <input type="text" name="type" class="info-modal-input" value="${employeeDesignation.employee_type_name}" readonly />
                </div>
            </div>

            <div class="column">
              <div class="input--box">
                <label>Employment Status</label>
                <input type="text" name="status" class="info-modal-input" value="${employeeDesignation.employee_status_name}" readonly />
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
