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

    modal.show();
    // Pass dates to getSalary function
    getSalary(startCutoff, endCutoff);
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

            const viewPayslipBtn = row.querySelector('.view-payslip-btn');
            viewPayslipBtn.addEventListener('click', () => {
                modal.style.display = 'block';
                const modalContent = document.getElementById('modal-content');
                modalContent.innerHTML = `
                `;
                modalCloseBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            });
        });

        console.log('all salary:', salaryData);
    } catch (error) {
        console.error('Error fetching salary:', error);
    }
}
