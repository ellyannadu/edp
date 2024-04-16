document.addEventListener('DOMContentLoaded', async function() {
   getSalary();
});

async function getSalary() {
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
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${salary.salary_id}</td>
                <td>${salary.employee_id}</td>
                <td>${salary.payroll_id}</td>
                <td>${salary.basic_pay}</td>
                <td>${salary.total_deductions}</td>
                <td>${salary.total_earnings}</td>
                <td>${salary.total_contributions}</td>
                <td>${salary.net_pay}</td>
                <td>
                    <button class="view-payslip-btn">View</button>
                </td>
            `;
            salaryTableBody.appendChild(row);

            const viewPayslipBtn = row.querySelector('.view-payslip-btn');
            viewPayslipBtn.addEventListener('click', () => {
                // dito ka maglagay ng payslip code
            });
        });

        console.log('all salary:', salaryData);
    } catch (error) {
        console.error('Error fetching salary:', error);
    }
}