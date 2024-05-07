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
            employeeIdCell.classList.add('employee-id');
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

            const employeeContributions = await getContributions(basicPay, totalEarnings, employee.employee_id, startCutoff);
            const totalContributions = parseFloat(employeeContributions);
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
        const filteredDeductions = deductionsData.filter((deduction) => {
            return deduction.employee_id === employeeId &&
                   deduction.deduction_date >= startCutoff &&
                   deduction.deduction_date <= endCutoff;
        });

        console.log('Filtered Deductions:', filteredDeductions);
        return filteredDeductions;
    } catch (error) {
        console.error('Error fetching and filtering deductions:', error);
    }
}

// Get contributions based on employeeId and date range
async function getContributions(basicPay, totalEarnings, employeeId, startCutoff) {
    const sss = calculateSSS(basicPay);
    const pagIbig = calculatePagIbig();
    const philHealth = calculatePhilHealth(basicPay);
    const withholdingTax = calculateWithholdingTax(totalEarnings);

    try {
        const startCutoffFormatted = new Date(startCutoff);
        startCutoffFormatted.setDate(startCutoffFormatted.getDate() + 1);
        const updatedStartCutoffFormatted = startCutoffFormatted.toISOString().split('T')[0];
        console.log(updatedStartCutoffFormatted);
    
        const responses = await Promise.all([
            fetch(`http://localhost:3000/sss/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employee_contrib: sss.employeeContribution,
                    employer_contrib: sss.employerContribution,
                    totalamount: sss.totalContribution,
                    date: updatedStartCutoffFormatted 
                }),
            }),
            fetch(`http://localhost:3000/pagIbig/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employee_contrib: pagIbig.employeeContribution,
                    employer_contrib: pagIbig.employerContribution,
                    totalamount: pagIbig.totalContribution,
                    date: updatedStartCutoffFormatted 
                }),
            }),
            fetch(`http://localhost:3000/philHealth/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employee_contrib: philHealth.employeeContribution,
                    employer_contrib: philHealth.employerContribution,
                    totalamount: philHealth.totalContribution,
                    date: updatedStartCutoffFormatted 
                }),
            }),
            fetch(`http://localhost:3000/tax/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: withholdingTax,
                    date: updatedStartCutoffFormatted 
                }),
            }),
        ]);

        const responseData = await Promise.all(responses.map(response => response.json()));
        console.log('All contributions updated:', responseData);
    } catch (error) {
        console.error('Error updating contributions:', error);
    }

    return pagIbig.employeeContribution + philHealth.employeeContribution + sss.employeeContribution + withholdingTax;
}



//----------------- Payslip Modal ----------------- 
// Add event listener to view payslip button
document.addEventListener('click', async function(event) {
    const target = event.target;
    if (target.classList.contains('view-details-btn')) {
        event.stopPropagation(); // Stop the click event from propagating to the window
        modal.style.display = 'block';

        try {
            // Obtain employeeId from the clicked row or element
            const employeeId = target.closest('tr').querySelector('.employee-id').textContent;
            const payrollId = window.sessionStorage.getItem('payrollId');
            const startCutoff = window.sessionStorage.getItem('startCutoff');
            const endCutoff = window.sessionStorage.getItem('endCutoff');
            const startCutoffFormatted = new Date(startCutoff).toDateString();
            const endCutoffFormatted = new Date(endCutoff).toDateString();

            // Fetch employee information, earnings, deductions, and payroll
            const [employeeResponse, earningsResponse, deductionsResponse, payrollResponse] = await Promise.all([
                fetch(`http://localhost:3000/assign-designation/${employeeId}`)
                // fetch(`http://localhost:3000/deductions/${employeeId}`),
                // fetch(`http://localhost:3000/payroll/${payrollId}`)
            ]);

            const employeeData = await employeeResponse.json();

            // Update modal content with fetched data
            document.getElementById('start-cutoff').textContent = startCutoffFormatted;
            document.getElementById('end-cutoff').textContent = endCutoffFormatted;
            document.getElementById('employee-name').textContent = `${employeeData.last_name}, ${employeeData.first_name} ${employeeData.middle_name}`;
            document.getElementById('employee-id').textContent = employeeId;
            document.getElementById('designation').textContent = employeeData.designation_name;
            document.getElementById('department').textContent = employeeData.department_name;
  
            // document.getElementById('sss').textContent = informationData.sss;
            // document.getElementById('philhealth').textContent = informationData.philhealth;
            // document.getElementById('pagibig').textContent = informationData.pagibig;
            // document.getElementById('withholding-tax').textContent = informationData.withholding_tax;
            // document.getElementById('total-contributions').textContent = informationData.total_contributions;
          
            // document.getElementById('total-earnings').textContent = payrollData.total_earnings;
            // document.getElementById('total-deductions').textContent = payrollData.total_deductions;
            // document.getElementById('net-pay').textContent = payrollData.net_pay;
            
            // document.getElementById('basic-pay').textContent = earningsData.basic_pay;
            // document.getElementById('AWOL').textContent = deductionsData.AWOL;
            // document.getElementById('bonus').textContent = earningsData.bonus;
            // document.getElementById('tardiness').textContent = deductionsData.tardiness;
            // document.getElementById('overtime-pay').textContent = earningsData.overtime_pay;
            // document.getElementById('property-damages').textContent = deductionsData.property_damages;
            // document.getElementById('commission').textContent = earningsData.commission;
            // document.getElementById('other-deductions').textContent = deductionsData.other_deductions;
            // document.getElementById('other-earnings').textContent = earningsData.other_earnings;
        } catch (error) {
        console.error('Error fetching payslip:', error);
        // Display an error message or handle the error in a suitable way
        }
    }
});
