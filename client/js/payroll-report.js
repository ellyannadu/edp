const modal = document.getElementById('payslip-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve variables from sessionStorage
    const payrollId = window.sessionStorage.getItem('payrollId');
    const startCutoff = window.sessionStorage.getItem('startCutoff');
    const endCutoff = window.sessionStorage.getItem('endCutoff');

    // Use the retrieved variables
    console.log('Payroll ID:', payrollId);
    console.log('Start Cutoff:', startCutoff);
    console.log('End Cutoff:', endCutoff);

    getEmployee();
    const totalEarnings = getEarnings(startCutoff, endCutoff, employeeId);
    const totalDeductions = getDeductions(startCutoff, endCutoff, employeeId);
    const totalContributions = getContributions(startCutoff, endCutoff, employeeId);
    const netPay = totalEarnings - totalDeductions - totalContributions;


    displayPayrollReport(payrollId);
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

function displayPayrollReport(payrollId) {
    // Fetch payroll report data
    fetch(`http://localhost:3000/payroll/${payrollId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch payroll report data');
            }
            return response.json();
        })
        .then(data => {
            // Display payroll report data
            console.log('Payroll Report Data:', data);
        })
        .catch(error => {
            console.error('Error fetching payroll report data:', error);
            // Display an error message or handle the error in a suitable way
        });
}

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

async function calculateTotalContributions(basicPay) {
    const sss = calculateSSS(basicPay);
    
    const pagIbig = calculatePagIbig();

    const philHealth = calculatePhilHealth(basicPay);

    const withholdingTax = calculateWithholdingTax(basicPay);

    console.log('Pag-IBIG:', pagIbig,
        'PhilHealth:', philHealth,
        'SSS:', sss,
        'Withholding Tax:', withholdingTax,
        'Basic Pay:', basicPay);
    return pagIbig.employeeContribution + philHealth.employeeContribution + sss.employeeContribution + withholdingTax;
}