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


        console.log('salaryData:', salaryData);
        // Create header row for the entire table and column headers
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th colspan="8" style="text-align: center;">PAYROLL REPORT from ${startCutoff.toDateString()} to ${endCutoff.toDateString()}</th>
        `;
        salaryTableBody.appendChild(headerRow);

        const columnHeadersRow = document.createElement('tr');
        columnHeadersRow.innerHTML = `
            <th>Payroll ID</th>
            <th>Employee ID</th>
            <th>Basic Pay</th>
            <th>Total Earnings</th>
            <th>Total Deductions</th>
            <th>Total Contributions</th>
            <th>Net Pay</th>
            <th>Actions</th>
        `;
        salaryTableBody.appendChild(columnHeadersRow);

        // Populate table rows with data
        salaryData.forEach(salary => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td style="text-align: center;">${salary.payroll_id}</td>
                <td style="text-align: center;">${salary.employee_id}</td>
                <td style="text-align: right;">${salary.basic_pay}</td>
                <td style="text-align: right;">${salary.total_deductions}</td>
                <td style="text-align: right;">${salary.total_earnings}</td>
                <td style="text-align: right;">${salary.total_contributions}</td>
                <td style="text-align: right;">${salary.net_pay}</td>
                <td>
                    <button class="view-payslip-btn">View</button>
                </td>
            `;
            salaryTableBody.appendChild(row);

            const viewPayslipBtn = row.querySelector('.view-payslip-btn');
            viewPayslipBtn.addEventListener('click', () => {
                // ARJ dito ka maglagay ng viewPayslip() function
                // sa payroll-report.html ka magawa ng payslip design
            });
        });

        console.log('all salary:', salaryData);
    } catch (error) {
        console.error('Error fetching salary:', error);
    }
}