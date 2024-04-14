import { calculatePagIbig, calculatePhilHealth, calculateSSS, calculateWithholdingTax } from "./gov_contributions.js";

const addDeductionModal = document.getElementById('add-deduction-modal');
const addEarningModal = document.getElementById('add-earning-modal');
const addPayrollModal = document.getElementById('add-payroll-modal');
const showDeductionsModalButton = document.getElementById('show-add-deduction-btn');
const showEarningsModalButton = document.getElementById('show-add-earning-btn');
const showPayrollModalButton = document.getElementById('show-add-payroll-btn');
const closeModalButtons = document.querySelectorAll('.close-add-modal-btn');
const dropdown = document.getElementById('employee-list');
const dropdown2 = document.getElementById('employee-list-2');

const showPayrollButton = document.getElementById('view-payroll-report-btn');
const showDeductionsButton = document.getElementById('view-deductions-btn');
const showEarningsButton = document.getElementById('view-earnings-btn');
const payrollContainer = document.getElementById('payroll-list');
const deductionsContainer = document.getElementById('deductions-list');
const earningsContainer = document.getElementById('earnings-list');

// On load of the payroll page
document.addEventListener('DOMContentLoaded', function() {
    getPayroll();
});

showDeductionsModalButton.addEventListener('click', function() {
    addDeductionModal.showModal();
});

showEarningsModalButton.addEventListener('click', function() {
    addEarningModal.showModal();
});

showPayrollModalButton.addEventListener('click', function() {
    addPayrollModal.showModal();
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (addDeductionModal.open) {
            addDeductionModal.close();
        } else if (addEarningModal.open) {
            addEarningModal.close();
        } else if (addPayrollModal.open) {
            addPayrollModal.close();
        }
    });
});

showPayrollButton.addEventListener('click', function() {
    payrollContainer.style.display = 'block';
    deductionsContainer.style.display = 'none';
    earningsContainer.style.display = 'none';
});

showDeductionsButton.addEventListener('click', function() {
    getDeductions();
    deductionsContainer.style.display = 'block';
    payrollContainer.style.display = 'none';
    earningsContainer.style.display = 'none';
});

showEarningsButton.addEventListener('click', function() {
    getEarnings();
    earningsContainer.style.display = 'block';
    payrollContainer.style.display = 'none';
    deductionsContainer.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === addDeductionModal) {
        addDeductionModal.close();
    } else if (event.target === addEarningModal) {
        addEarningModal.close();
    } else if (event.target === addPayrollModal) {
        addPayrollModal.close();
    }
});


// ================== Fetch Employee Names / Search Name ==================
// Function to fetch employee names and populate the dropdown
async function fetchEmployeeNames() {
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

                // Event listener for each employee list item
                listItem.addEventListener('click', function() {
                    const selectedName = this.textContent;
                    const selectedId = this.dataset.value;
                    document.getElementById('edit-search-input').value = selectedName;
                    document.getElementById('edit-search-input-2').value = selectedName;
                    document.getElementById('employee-id').value = selectedId;
                    document.getElementById('employee-id-2').value = selectedId;
                    dropdown.style.display = 'none';
                    dropdown2.style.display = 'none';
                });
            });
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

// Event listener for input field to trigger fetching employee names
document.getElementById('edit-search-input').addEventListener('input', function () {
    const searchInput = this.value.toLowerCase();
    const dropdownOptions = document.querySelectorAll('.employee-list-item');

    dropdownOptions.forEach((option) => {
        const text = option.textContent.toLowerCase();
        if (text.includes(searchInput)) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });
});

// Event listener for input field to trigger fetching employee names
document.getElementById('edit-search-input-2').addEventListener('input', function () {
    const searchInput = this.value.toLowerCase();
    const dropdownOptions = document.querySelectorAll('.employee-list-item');

    dropdownOptions.forEach((option) => {
        const text = option.textContent.toLowerCase();
        if (text.includes(searchInput)) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });
});

// Event listener to handle click on dropdown item
document.addEventListener('click', function (event) {
    const target = event.target;

    if (target.closest('.edit-search-input')) {
        dropdown.style.display = 'block';
        dropdown2.style.display = 'block';
        fetchEmployeeNames();
        console.log('clicked input field');
    } else if (!dropdown.contains(target)) {
        dropdown.style.display = 'none'; // Hide dropdown if clicked outside
    } else if (!dropdown2.contains(target)) {
        dropdown2.style.display = 'none'; // Hide dropdown if clicked outside
    }
});
// ========================================================================

// ================== Show Deduction / Earning / Payroll Functions ==================
// Fetch all deductions
async function getDeductions() {
    try {
        const response = await fetch('http://localhost:3000/deductions');
        if (!response.ok) {
            throw new Error('Failed to fetch deductions');
        }
        const allDeductions = await response.json();
        const deductionsTableBody = document.getElementById('deductions-table-body');
        deductionsTableBody.innerHTML = ''; // Clear existing table rows
        
        allDeductions.forEach(deduction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${deduction.deduction_id}</td>
                <td>${deduction.employee_id}</td>
                <td>${deduction.deduction_date.split('T')[0]}</td>
                <td>${deduction.deduction_type}</td>
                <td>${deduction.deduction_amount}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            deductionsTableBody.appendChild(row);
        });

        console.log('all deductions:', allDeductions);
    } catch (error) {
        console.error('Error fetching deductions:', error);
    }
}

// Fetch all earnings
async function getEarnings() {
    try {
        const response = await fetch('http://localhost:3000/earnings');
        if (!response.ok) {
            throw new Error('Failed to fetch earnings');
        }
        const allEarnings = await response.json();
        const earningsTableBody = document.getElementById('earnings-table-body');
        earningsTableBody.innerHTML = ''; // Clear existing table rows

        allEarnings.forEach(earning => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${earning.earning_id}</td>
                <td>${earning.employee_id}</td>
                <td>${earning.earning_date.split('T')[0]}</td>
                <td>${earning.earning_type}</td>
                <td>${earning.earning_amount}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            earningsTableBody.appendChild(row);
        });

        console.log('all earnings:', allEarnings);
    } catch (error) {
        console.error('Error fetching earnings:', error);
    }
}

// Fetch all payroll
async function getPayroll() {
    try {
        const response = await fetch('http://localhost:3000/payroll');
        if (!response.ok) {
            throw new Error('Failed to fetch payroll');
        }
        const allPayroll = await response.json();
        const payrollTableBody = document.getElementById('payroll-table-body');
        payrollTableBody.innerHTML = ''; // Clear existing table rows

        allPayroll.forEach(payroll => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payroll.pay_date.split('T')[0]}</td>
                <td>${payroll.start_date.split('T')[0]}</td>
                <td>${payroll.end_date.split('T')[0]}</td>
                <td>${payroll.status}</td>
                <td>
                    <button class="view-report-details-btn">View</button>
                </td>
            `;
            payrollTableBody.appendChild(row);
            
            // Event listener for "View" button
            const viewReportBtn = row.querySelector('.view-report-details-btn');
            viewReportBtn.addEventListener('click', () => {
                const reportUrl = `http://localhost:3000/reports/${payroll.payroll_id}`; // Example URL
                window.open(reportUrl, '_blank'); // Open in new tab
            });
        });

        console.log('all payroll:', allPayroll);
    } catch (error) {
        console.error('Error fetching payroll:', error);
    }
}
// ========================================================================

