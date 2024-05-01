import { calculatePagIbig, calculatePhilHealth, calculateSSS, calculateWithholdingTax } from "./gov_contributions.js";

const modal = document.getElementById('payslip-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

document.addEventListener('DOMContentLoaded', async () => {
    // Retrieve variables from sessionStorage
    const payrollId = window.sessionStorage.getItem('payrollId');
    const startCutoff = window.sessionStorage.getItem('startCutoff');
    const endCutoff = window.sessionStorage.getItem('endCutoff');

    // Use the retrieved variables
    console.log('Payroll ID:', payrollId);
    console.log('Start Cutoff:', startCutoff);
    console.log('End Cutoff:', endCutoff);

    // Fetch all active employees record for payroll report
    getPayrollReport(startCutoff, endCutoff);

    // delete this line after formatting modal, for testing purposes only
    // modal.show();
});

window.addEventListener('click', function(event) {
    if (event.target !== modal && !modal.contains(event.target)) {
        modal.style.display = 'none';
    }
});

modalCloseBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// ----------------- FUNCTIONS -----------------
// Fetch all active employees record for payroll report
async function getPayrollReport(startCutoff, endCutoff) {
    try {
        const employeeList = await getEmployees();
        const tableBody = document.getElementById('salary-table-body');
        tableBody.innerHTML = ''; // Clear previous rows

        for (const employee of employeeList) {
            const employeeRow = document.createElement('tr');

            const employeeIdCell = document.createElement('td');
            employeeIdCell.textContent = employee.employee_id;
            employeeRow.appendChild(employeeIdCell);

            const employeeNameCell = document.createElement('td');
            employeeNameCell.textContent = `${employee.last_name}, ${employee.first_name} ${employee.middle_name}`;
            employeeRow.appendChild(employeeNameCell);

            const employeeEarnings = await getEarnings(startCutoff, endCutoff, employee.employee_id);
            const basicPayObject = employeeEarnings.find(earning => earning.earning_type === 'Basic Pay');
            const basicPay = basicPayObject ? basicPayObject.earning_amount : 0;
            console.log('Basic Pay:', basicPay);
            const totalEarnings = Array.isArray(employeeEarnings) ? employeeEarnings.reduce((total, earning) => total + parseFloat(earning.earning_amount), 0) : 0;
            const totalEarningsCell = document.createElement('td');
            totalEarningsCell.textContent = totalEarnings.toFixed(2);
            employeeRow.appendChild(totalEarningsCell);

            const employeeDeductions = await getDeductions(startCutoff, endCutoff, employee.employee_id);
            const totalDeductions = Array.isArray(employeeDeductions) ? employeeDeductions.reduce((total, deduction) => total + parseFloat(deduction.deduction_amount), 0) : 0;
            const totalDeductionsCell = document.createElement('td');
            totalDeductionsCell.textContent = totalDeductions.toFixed(2);
            employeeRow.appendChild(totalDeductionsCell);

            const employeeContributions = await getContributions(basicPay);
            const totalContributions = Array.isArray(employeeContributions) ? employeeContributions.reduce((total, contribution) => total + parseFloat(contribution.contribution_amount), 0) : 0;
            const totalContributionsCell = document.createElement('td');
            totalContributionsCell.textContent = totalContributions.toFixed(2);
            employeeRow.appendChild(totalContributionsCell);

            const netPay = totalEarnings - totalDeductions - totalContributions;
            const netPayCell = document.createElement('td');
            netPayCell.textContent = netPay.toFixed(2);
            employeeRow.appendChild(netPayCell);

            const actionsCell = document.createElement('td');
            // Add actions buttons or links if needed
            actionsCell.innerHTML = `<button class="view-details-btn">View Details</button>`;
            employeeRow.appendChild(actionsCell);

            tableBody.appendChild(employeeRow);
        }
    } catch (error) {
        console.error('Error fetching payroll report:', error);
    }
}

// Get all ACTIVE employees 
async function getEmployees() {
    try {
        const response = await fetch(`http://localhost:3000/employees`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Get earnings based on employeeId and date range
async function getEarnings(startCutoff, endCutoff, employeeId) {
    try {
        const earningsResponse = await fetch(`http://localhost:3000/earnings`);
        if (!earningsResponse.ok) {
            throw new Error('Failed to fetch earnings data');
        }
        const earningsData = await earningsResponse.json();

        // Filter earnings based on employeeId and date range
        const filteredEarnings = earningsData.filter((earning) => {
            return earning.employee_id === employeeId &&
                   earning.earning_date >= startCutoff &&
                   earning.earning_date <= endCutoff;
        });

        console.log('Filtered Earnings:', filteredEarnings);
        return filteredEarnings;
    } catch (error) {
        console.error('Error fetching and filtering earnings:', error);
    }
}

// Get deductions based on employeeId and date range
async function getDeductions(startCutoff, endCutoff, employeeId) {
    try {
        const deductionsResponse = await fetch(`http://localhost:3000/deductions`);
        if (!deductionsResponse.ok) {
            throw new Error('Failed to fetch earnings data');
        }
        const deductionsData = await deductionsResponse.json();

        // Filter earnings based on employeeId and date range
        const filteredEarnings = deductionsData.filter((deduction) => {
            return deduction.employee_id === employeeId &&
                   deduction.deduction_date >= startCutoff &&
                   deduction.deduction_date <= endCutoff;
        });

        console.log('Filtered Earnings:', filteredEarnings);
        return filteredEarnings;
    } catch (error) {
        console.error('Error fetching and filtering earnings:', error);
    }
}

// Get contributions based on employeeId and date range
async function getContributions(basicPay) {
    const sss = calculateSSS(basicPay);
    
    const pagIbig = calculatePagIbig();

    const philHealth = calculatePhilHealth(basicPay);

    const withholdingTax = calculateWithholdingTax(basicPay);

    // console.log('Pag-IBIG:', pagIbig,
    //     'PhilHealth:', philHealth,
    //     'SSS:', sss,
    //     'Withholding Tax:', withholdingTax,
    //     'Basic Pay:', basicPay);
    return pagIbig.employeeContribution + philHealth.employeeContribution + sss.employeeContribution + withholdingTax;
}

//----------------- Payslip Modal -----------------
// Add event listener to view payslip button
document.addEventListener('click', async function(event) {
    const target = event.target;
    if (target.classList.contains('view-payslip-btn')) {
        event.stopPropagation(); // Stop the click event from propagating to the window
        modal.style.display = 'block';
        try {
            const [informationResponse, deductionsResponse, earningsResponse, payrollResponse] = await Promise.all([
                fetch(`http://localhost:3000/assign-designation/${employeeId}`),
                fetch(`http://localhost:3000/deductions`),
                fetch(`http://localhost:3000/earnings`),
                fetch(`http://localhost:3000/payroll/${payrollId}`)
            ]);

            if (!informationResponse.ok || !deductionsResponse.ok || !earningsResponse.ok || !payrollResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const [informationData, deductionsData, earningsData, payrollData] = await Promise.all([
                informationResponse.json(),
                deductionsResponse.json(),
                earningsResponse.json(),
                payrollResponse.json()
            ]);

            // Update modal content with fetched data
            const startDate = payrollData.start_date;
            const endDate = payrollData.end_date;
            document.getElementById('start-cutoff').textContent = startDate;
            document.getElementById('end-cutoff').textContent = endDate;
            // Update other modal content based on fetched data

        } catch (error) {
            console.error('Error fetching payslip:', error);
            // Display an error message or handle the error in a suitable way
        }
    }
});