const modal = document.getElementById('payslip-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

document.addEventListener('DOMContentLoaded', async function() {
    // Retrieve variables from sessionStorage
    const payrollId = window.sessionStorage.getItem('payrollId');
    const startCutoffStr = window.sessionStorage.getItem('startCutoff');
    const endCutoffStr = window.sessionStorage.getItem('endCutoff');

    // Convert date strings to date objects
    const startCutoff = new Date(startCutoffStr);
    const endCutoff = new Date(endCutoffStr);

    // Use the retrieved variables
    console.log('Payroll ID:', payrollId);
    console.log('Start Cutoff:', startCutoff);
    console.log('End Cutoff:', endCutoff);

    // delete this line after formatting modal, for testing purposes only
    // modal.show();
    
    // Pass dates to getSalary function
    getSalary(startCutoff, endCutoff);
});

window.addEventListener('click', function(event) {
    if (event.target !== modal && !modal.contains(event.target)) {
        modal.style.display = 'none';
    }
});

modalCloseBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

async function getSalary(startCutoff, endCutoff) {
    try{
        const response = await fetch('http://localhost:3000/salary');
        if (!response.ok) {
            throw new Error('Failed to fetch salary');
        }
        const salaryData = await response.json();
        
        const salaryTableBody = document.getElementById('salary-table-body');
        salaryTableBody.innerHTML = '';

        // Populate table rows with data
        salaryData.forEach(salary => {
             // Update the header text with the correct date range
            const headerText = document.getElementById('header-text');
            headerText.textContent = `PAYROLL REPORT #${salary.payroll_id} from ${startCutoff.toDateString()} to ${endCutoff.toDateString()}`;
        
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${salary.employee_id}</td>
                <td>${salary.basic_pay}</td>
                <td>${salary.total_earnings}</td>
                <td>${salary.total_deductions}</td>
                <td>${salary.total_contributions}</td>
                <td>${salary.net_pay}</td>
                <td>
                    <button class="view-payslip-btn">View</button>
                </td>
            `;
            salaryTableBody.appendChild(row);
        });

        console.log('all salary:', salaryData);
    } catch (error) {
        console.error('Error fetching salary:', error);
    }
}

// Add event listener to view payslip button
document.addEventListener('click', async function(event) {
    const target = event.target;
    if (target.classList.contains('view-payslip-btn')) {
        event.stopPropagation(); // Stop the click event from propagating to the window
        modal.style.display = 'block';
        try {
            const [informationResponse, deductionsResponse, earningsResponse, salariesResponse, payrollResponse] = await Promise.all([
                fetch(`http://localhost:3000/assign-designation/${employeeId}`),
                fetch(`http://localhost:3000/deductions`),
                fetch(`http://localhost:3000/earnings`),
                fetch(`http://localhost:3000/contributions`),
                fetch(`http://localhost:3000/salary`),
                fetch(`http://localhost:3000/payroll/${payrollId}`)
            ]);

            if (!deductionsResponse.ok || !earningsResponse.ok || !salariesResponse.ok || !payrollResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const [allDeductions, allEarnings, allSalaries, payrollData] = await Promise.all([
                deductionsResponse.json(),
                earningsResponse.json(),
                salariesResponse.json(),
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
        }
    }
});
