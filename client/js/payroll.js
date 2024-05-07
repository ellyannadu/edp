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
document.addEventListener('DOMContentLoaded', async function() {
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

// ================== FORM SUBMISSIONS ==================

// On form submission "Generate Payroll"
document.getElementById('generate-payroll-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const startDate = document.getElementById('start-cutoff').value;
    const endDate = document.getElementById('end-cutoff').value;
    const payDate = document.getElementById('pay-date').value;

    try {
        // Generate payroll
        const payrollResponse = await fetch('http://localhost:3000/payroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_date: startDate,
                end_date: endDate,
                pay_date: payDate,
                status: 'Pending'
            })
        });

        if (!payrollResponse.ok) {
            throw new Error('Failed to generate payroll');
        }

        // Extract the payroll_id from the response JSON
        const payrollData = await payrollResponse.json();
        const payrollId = payrollData.payroll_id;

        console.log('Generated payroll with ID:', payrollId);

        // Fetch all employees
        const employeeResponse = await fetch('http://localhost:3000/employee');
        if (!employeeResponse.ok) {
            throw new Error('Failed to fetch employees');
        }
        const allEmployees = await employeeResponse.json();

        // Process each employee
        await Promise.all(allEmployees.map(async (employee) => {
            // Fetch employee's status from assign_designation table
            const assignDesignationResponse = await fetch(`http://localhost:3000/assign-designation/${employee.employee_id}`);
            if (!assignDesignationResponse.ok) {
                throw new Error(`Failed to fetch employee status for ID ${employee.employee_id}`);
            }
            const assignDesignationData = await assignDesignationResponse.json();
            const employeeStatus = assignDesignationData.employee_status;

            if (employeeStatus === 1) {
      
                const [
                    { philhealth_id: philHealth_id },
                    { pagibig_id: pagIbig_id },
                    { sss_id: sss_id },
                    { tax_id: tax_id }
                ] = await Promise.all([
                    initializePhilHealth(employee.employee_id, startDate).catch(error => {
                        console.error('Error initializing PhilHealth:', error);
                        return null;
                    }),
                    initializePagIbig(employee.employee_id, startDate).catch(error => {
                        console.error('Error initializing PagIbig:', error);
                        return null;
                    }),
                    initializeSSS(employee.employee_id, startDate).catch(error => {
                        console.error('Error initializing SSS:', error);
                        return null;
                    }),
                    initializeTax(employee.employee_id, startDate).catch(error => {
                        console.error('Error initializing Tax:', error);
                        return null;
                    })
                ]);                
                
                // console.log('sss_id:', sss_id, 'philHealth_id:', philHealth_id, 'pagIbig_id:', pagIbig_id, 'tax_id:', tax_id);                
            } else {
                console.log(`Employee ID ${employee.employee_id} is inactive. Skipping salary creation.`);
            }
        }));

        getPayroll();
    } catch (error) {
        console.error('Error generating payroll or creating salaries:', error);
    }
});

// On form submission "Add deductions"
document.getElementById('add-deduction-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const employee_id = document.getElementById('employee-id').value;
    const deduction_date = document.getElementById('deduction-date').value;
    const deduction_type = document.getElementById('deduction-type').value;
    const deduction_amount = document.getElementById('deduction-amount').value;

    try{
        const response = await fetch('http://localhost:3000/deductions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employee_id: employee_id,
                deduction_date: deduction_date,
                deduction_type: deduction_type,
                deduction_amount: deduction_amount
            })
        });
        if (!response.ok) {
            throw new Error('Failed to add deduction');
        }

        console.log('Added deduction:', response);
        getDeductions();
    } catch (error) {
        console.error('Error adding deduction:', error);
    }
});   

// On form submission "Add earnings"
document.getElementById('add-earning-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const employee_id = document.getElementById('employee-id').value;
    const earning_date = document.getElementById('earning-date').value;
    const earning_type = document.getElementById('earning-type').value;
    const earning_amount = document.getElementById('earning-amount').value;

    try{
        const response = await fetch('http://localhost:3000/earnings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employee_id: employee_id,
                earning_date: earning_date,
                earning_type: earning_type,
                earning_amount: earning_amount
            })
        });
        if (!response.ok) {
            throw new Error('Failed to add earning');
        }

        console.log('Added earning:', response);
        getEarnings();
    } catch (error) {
        console.error('Error adding earning:', error);
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
            allEmployees.forEach(async employee => {
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

// ================== ASYNC FUNCTIONS Deduction / Earning / Payroll Functions ==================
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
            const deductionDate = new Date(deduction.deduction_date);
            deductionDate.setDate(deductionDate.getDate() + 1);

            row.innerHTML = `
                <td>${deduction.deduction_id}</td>
                <td>${deduction.employee_id}</td>
                <td>${deductionDate.toISOString().split('T')[0]}</td>
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

            const earningDate = new Date(earning.earning_date);
            earningDate.setDate(earningDate.getDate() + 1);

            row.innerHTML = `
                <td>${earning.earning_id}</td>
                <td>${earning.employee_id}</td>
                <td>${earningDate.toISOString().split('T')[0]}</td>
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
            const payDate = new Date(payroll.pay_date);
            const startCutoff = new Date(payroll.start_date);
            const endCutoff = new Date(payroll.end_date);
            payDate.setDate(payDate.getDate() + 1);
            startCutoff.setDate(startCutoff.getDate() + 1);
            endCutoff.setDate(endCutoff.getDate() + 1);

            row.innerHTML = `
                <td>${payDate.toISOString().split('T')[0]}</td>
                <td>${startCutoff.toISOString().split('T')[0]}</td>
                <td>${endCutoff.toISOString().split('T')[0]}</td>
                <td>${payroll.status}</td>
                <td>
                    <button class="view-report-details-btn">View</button>
                </td>
            `;
            payrollTableBody.appendChild(row);
            
            // Event listener for "View" button
            const viewReportBtn = row.querySelector('.view-report-details-btn');
            viewReportBtn.addEventListener('click', () => {
                const payrollId = payroll.payroll_id;
                const startCutoff = payroll.start_date;
                const endCutoff = payroll.end_date;
            
                console.log('Payroll ID:', payrollId);
                console.log('Start Cutoff:', startCutoff);
                console.log('End Cutoff:', endCutoff);
            
                // Open new tab
                const newTab = window.open('payroll-report.html', '_blank');
            
                // Set sessionStorage in the new tab
                newTab.addEventListener('load', () => {
                    newTab.sessionStorage.setItem('payrollId', payrollId);
                    newTab.sessionStorage.setItem('startCutoff', startCutoff);
                    newTab.sessionStorage.setItem('endCutoff', endCutoff);
                });
            });            
        });

        console.log('all payroll:', allPayroll);
    } catch (error) {
        console.error('Error fetching payroll:', error);
    }
}

// ============== Initialize Government Contributions to 0 =============
async function initializePhilHealth(employeeId, startDate) {
    try {
        const response = await fetch(`http://localhost:3000/philHealth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employee_id: employeeId,
                employee_contrib: 0,
                employer_contrib: 0,
                totalAmount: 0,
                date: startDate,
            })
        });

        return response.json();
    } catch (error) {
        console.error('Error initializing PhilHealth:', error);
    }
}

async function initializePagIbig(employeeId, startDate) {
    try {
        const response = await fetch(`http://localhost:3000/pagIbig`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employee_id: employeeId,
                employee_contrib: 0,
                employer_contrib: 0,
                totalAmount: 0,
                date: startDate,
            })
        });

        return response.json();
    } catch (error) {
        console.error('Error initializing PagIbig:', error);
    }
}

async function initializeSSS(employeeId, startDate) {
    try {
        const response = await fetch(`http://localhost:3000/sss`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employee_id: employeeId,
                employee_contrib: 0,
                employer_contrib: 0,
                totalAmount: 0,
                date: startDate,
            })
        });

        return response.json();
    } catch (error) {
        console.error('Error initializing SSS:', error);
    }
}

async function initializeTax(employeeId, startDate) {
    try {
        const response = await fetch(`http://localhost:3000/tax`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employee_id: employeeId,
                amount: 0,
                date: startDate,
            })
        });

        return response.json();
    } catch (error) {
        console.error('Error initializing Tax:', error);
    }
}


