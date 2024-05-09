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
    getPayrollReport(startCutoff, endCutoff, payrollId);

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
async function getPayrollReport(startCutoff, endCutoff, payrollId) {
    try {
        const employeeList = await getEmployees();
        const tableBody = document.getElementById('salary-table-body');
        tableBody.innerHTML = ''; // Clear previous rows

        const startDate = new Date(startCutoff).toDateString();
        const endDate = new Date(endCutoff).toDateString();
        const header = document.getElementById('header-text');
        header.textContent = `PAYROLL REPORT #${payrollId} from ${startDate} to ${endDate}`;


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

            const totalEarnings = Array.isArray(employeeEarnings) ? employeeEarnings.reduce((total, earning) => total + parseFloat(earning.earning_amount), 0) : 0;
            const totalEarningsCell = document.createElement('td');
            totalEarningsCell.textContent = formatCurrency(totalEarnings);
            employeeRow.appendChild(totalEarningsCell);

            const employeeDeductions = await getDeductions(startCutoff, endCutoff, employee.employee_id);
            const totalDeductions = Array.isArray(employeeDeductions) ? employeeDeductions.reduce((total, deduction) => total + parseFloat(deduction.deduction_amount), 0) : 0;
            const totalDeductionsCell = document.createElement('td');
            totalDeductionsCell.textContent = formatCurrency(totalDeductions);
            employeeRow.appendChild(totalDeductionsCell);

            const employeeContributions = await getContributions(basicPay, totalEarnings, employee.employee_id, startCutoff);
            const totalContributions = parseFloat(employeeContributions);
            const totalContributionsCell = document.createElement('td');
            totalContributionsCell.textContent = formatCurrency(totalContributions);
            employeeRow.appendChild(totalContributionsCell);

            const netPay = totalEarnings - totalDeductions - totalContributions;
            const netPayCell = document.createElement('td');
            netPayCell.textContent = formatCurrency(netPay);
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

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
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

        // console.log('Filtered Deductions:', filteredDeductions);
        return filteredDeductions;
    } catch (error) {
        console.error('Error fetching and filtering deductions:', error);
    }
}

// Get contributions based on employeeId and date range
async function getContributions(basicPay, totalEarnings, employeeId, startCutoff) {
    const sss = calculateSSS(totalEarnings);
    const pagIbig = calculatePagIbig();
    const philHealth = calculatePhilHealth(totalEarnings);
    const withholdingTax = calculateWithholdingTax(totalEarnings);

    try {
        const startCutoffFormatted = new Date(startCutoff);
        startCutoffFormatted.setDate(startCutoffFormatted.getDate() + 1);
        const updatedStartCutoffFormatted = startCutoffFormatted.toISOString().split('T')[0];
        // console.log(updatedStartCutoffFormatted);
    
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
            const startCutoff = window.sessionStorage.getItem('startCutoff');
            const endCutoff = window.sessionStorage.getItem('endCutoff');
            const startCutoffDate = new Date(startCutoff);
            const endCutoffDate = new Date(endCutoff);
            const startCutoffFormatted = new Date(startCutoff).toDateString();
            const endCutoffFormatted = new Date(endCutoff).toDateString();

            // Fetch employee information, earnings, deductions, and payroll
            const [employeeResponse, payslipResponse, deductionsResponse, earningsResponse,
                sssResponse, pagIbigResponse, philHealthResponse, taxResponse] = await Promise.all([
                fetch(`http://localhost:3000/assign-designation/${employeeId}`),
                fetch(`http://localhost:3000/payslip/${employeeId}`),
                fetch(`http://localhost:3000/deductions/${employeeId}`),
                fetch(`http://localhost:3000/earnings/${employeeId}`),
                fetch(`http://localhost:3000/sss/${employeeId}`),
                fetch(`http://localhost:3000/pagIbig/${employeeId}`),
                fetch(`http://localhost:3000/philHealth/${employeeId}`),
                fetch(`http://localhost:3000/tax/${employeeId}`)
            ]);

            const employeeData = await employeeResponse.json();
            const payslipData = await payslipResponse.json();
            const deductionsData = await deductionsResponse.json();
            const earningsData = await earningsResponse.json();
            const sssData = await sssResponse.json();
            const pagIbigData = await pagIbigResponse.json();
            const philHealthData = await philHealthResponse.json();
            const taxData = await taxResponse.json();

            // Update modal content with fetched data
            document.getElementById('start-cutoff').textContent = startCutoffFormatted;
            document.getElementById('end-cutoff').textContent = endCutoffFormatted;
            document.getElementById('employee-name').textContent = `${employeeData.last_name}, ${employeeData.first_name} ${employeeData.middle_name}`;
            document.getElementById('employee-id').textContent = employeeId;
            document.getElementById('designation').textContent = employeeData.designation_name;
            document.getElementById('department').textContent = employeeData.department_name;

            const basicPayObject = earningsData.filter(item => item.earning_type === 'Basic Pay' && new Date(item.earning_date) >= startCutoffDate && new Date(item.earning_date) <= endCutoffDate);
            const basicPayAmount = basicPayObject.reduce((total, item) => total + parseFloat(item.earning_amount), 0);
            const bonusObject = earningsData.filter(item => item.earning_type === 'Bonus' && new Date(item.earning_date) >= startCutoffDate && new Date(item.earning_date) <= endCutoffDate);
            const bonusAmount = bonusObject.reduce((total, item) => total + parseFloat(item.earning_amount), 0);
            const overtimeObject = earningsData.filter(item => item.earning_type === 'Overtime' && new Date(item.earning_date) >= startCutoffDate && new Date(item.earning_date) <= endCutoffDate);
            const overtimeAmount = overtimeObject.reduce((total, item) => total + parseFloat(item.earning_amount), 0);
            const commissionObject = earningsData.filter(item => item.earning_type === 'Commission' && new Date(item.earning_date) >= startCutoffDate && new Date(item.earning_date) <= endCutoffDate); 
            const commissionAmount = commissionObject.reduce((total, item) => total + parseFloat(item.earning_amount), 0);   
            const otherEarningsObject = earningsData.filter(item => item.earning_type === 'Others' && new Date(item.earning_date) >= startCutoffDate && new Date(item.earning_date) <= endCutoffDate); 
            const otherEarningsAmount = otherEarningsObject.reduce((total, item) => total + parseFloat(item.earning_amount), 0);

            document.getElementById('basic-pay').textContent = basicPayAmount.toFixed(2);
            document.getElementById('bonus').textContent = bonusAmount.toFixed(2);
            document.getElementById('overtime-pay').textContent = overtimeAmount.toFixed(2);
            document.getElementById('commission').textContent = commissionAmount.toFixed(2);
            document.getElementById('other-earnings').textContent = otherEarningsAmount.toFixed(2);

            const AWOLObjects = deductionsData.filter(item => item.deduction_type === 'AWOL' && new Date(item.deduction_date) >= startCutoffDate && new Date(item.deduction_date) <= endCutoffDate);
            const AWOLAmount = AWOLObjects.reduce((total, item) => total + parseFloat(item.deduction_amount), 0);
            const tardinessObject = deductionsData.filter(item => item.deduction_type === 'Late' && new Date(item.deduction_date) >= startCutoffDate && new Date(item.deduction_date) <= endCutoffDate);
            const tardinessAmount = tardinessObject.reduce((total, item) => total + parseFloat(item.deduction_amount), 0);
            const propertyDamagesObject = deductionsData.filter(item => item.deduction_type === 'Damage' && new Date(item.deduction_date) >= startCutoffDate && new Date(item.deduction_date) <= endCutoffDate);
            const propertyDamagesAmount = propertyDamagesObject.reduce((total, item) => total + parseFloat(item.deduction_amount), 0);
            const otherDeductionsObject = deductionsData.filter(item => item.deduction_type === 'Others' && new Date(item.deduction_date) >= startCutoffDate && new Date(item.deduction_date) <= endCutoffDate);
            const otherDeductionsAmount = otherDeductionsObject.reduce((total, item) => total + parseFloat(item.deduction_amount), 0);

            document.getElementById('AWOL').textContent = AWOLAmount.toFixed(2);
            document.getElementById('tardiness').textContent = tardinessAmount.toFixed(2);
            document.getElementById('property-damages').textContent = propertyDamagesAmount.toFixed(2);
            document.getElementById('other-deductions').textContent = otherDeductionsAmount.toFixed(2);

            const sssContrib = sssData.filter(item => new Date(item.date) >= startCutoffDate && new Date(item.date) <= endCutoffDate);
            const sssAmount = sssContrib.reduce((total, item) => total + parseFloat(item.employee_contrib), 0);
            const pagibigContrib = pagIbigData.filter(item => new Date(item.date) >= startCutoffDate && new Date(item.date) <= endCutoffDate);
            const pagIbigAmount = pagibigContrib.reduce((total, item) => total + parseFloat(item.employee_contrib), 0);
            const philhealthContrib = philHealthData.filter(item => new Date(item.date) >= startCutoffDate && new Date(item.date) <= endCutoffDate);
            const philHealthAmount = philhealthContrib.reduce((total, item) => total + parseFloat(item.employee_contrib), 0);
            const taxContrib = taxData.filter(item => new Date(item.date) >= startCutoffDate && new Date(item.date) <= endCutoffDate);
            const taxAmount = taxContrib.reduce((total, item) => total + parseFloat(item.amount), 0);

            console.log('SSS:', sssAmount);
            document.getElementById('sss').textContent = sssAmount.toFixed(2);
            document.getElementById('pagibig').textContent = pagIbigAmount.toFixed(2);
            document.getElementById('philhealth').textContent = philHealthAmount.toFixed(2);
            document.getElementById('withholding-tax').textContent = taxAmount.toFixed(2);

            const totalEarnings = basicPayAmount + bonusAmount + overtimeAmount + commissionAmount + otherEarningsAmount;
            const totalDeductions = AWOLAmount + tardinessAmount + propertyDamagesAmount + otherDeductionsAmount;
            const totalContributions = sssAmount + pagIbigAmount + philHealthAmount + taxAmount;
            const netPay = totalEarnings - totalDeductions - totalContributions;

            document.getElementById('total-earnings').textContent = totalEarnings.toFixed(2);
            document.getElementById('total-deductions').textContent = totalDeductions.toFixed(2);
            document.getElementById('total-contributions').textContent = totalContributions.toFixed(2);
            document.getElementById('net-pay').textContent = formatCurrency(netPay);


        } catch (error) {
            console.error('Error fetching payslip:', error);
        }
    }
});
