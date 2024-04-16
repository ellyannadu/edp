// Function to calculate the Pag-IBIG contributions of an employee
export function calculatePagIbig() {
    // fixed 200 pesos for both employee and employer
    let employeeContribution = 200;
    let employerContribution = 200;

    return {
        employeeContribution: employeeContribution,
        employerContribution: employerContribution,
        totalContribution: employeeContribution + employerContribution
    };
}

// Function to calculate the PhilHealth contributions of an employee
export function calculatePhilHealth(employeeMonthlySalary) {
    let totalContribution = 0;

    if (employeeMonthlySalary >= 100000) {
        employeeMonthlySalary = Math.min(employeeMonthlySalary, 100000);
        totalContribution = employeeMonthlySalary * 0.05;
    } else if (employeeMonthlySalary < 100000 && employeeMonthlySalary > 10000) {
        totalContribution = Math.max(Math.min(employeeMonthlySalary * 0.05, 5000), 500);
    } else {
        totalContribution = Math.min(employeeMonthlySalary * 0.05, 500);
    }

    return {
        totalContribution: totalContribution,
        employeeContribution: totalContribution / 2,
        employerContribution: totalContribution / 2
    };
}

// Function to calculate the SSS contributions of an employee
export function calculateSSS(employeeMonthlySalary) {
    const sssContributionTable = [
        { minSalary: 0, maxSalary: 4249.99, employeeContribution: 180, employerContribution: 390, totalContribution: 570 },
        { minSalary: 4250, maxSalary: 4749.99, employeeContribution: 202.50, employerContribution: 437.50, totalContribution: 640 },
        { minSalary: 4750, maxSalary: 5249.99, employeeContribution: 225, employerContribution: 485, totalContribution: 710 },
        { minSalary: 5250, maxSalary: 5749.99, employeeContribution: 247.50, employerContribution: 532.50, totalContribution: 780 },
        { minSalary: 5750, maxSalary: 6249.99, employeeContribution: 270, employerContribution: 580, totalContribution: 850 },
        { minSalary: 6250, maxSalary: 6749.99, employeeContribution: 292.50, employerContribution: 627.50, totalContribution: 920 },
        { minSalary: 6750, maxSalary: 7249.99, employeeContribution: 315, employerContribution: 675, totalContribution: 990 },
        { minSalary: 7250, maxSalary: 7749.99, employeeContribution: 337.50, employerContribution: 722.50, totalContribution: 1060 },
        { minSalary: 7750, maxSalary: 8249.99, employeeContribution: 360, employerContribution: 770, totalContribution: 1130 },
        { minSalary: 8250, maxSalary: 8749.99, employeeContribution: 382.50, employerContribution: 817.50, totalContribution: 1200 },
        { minSalary: 8750, maxSalary: 9249.99, employeeContribution: 405, employerContribution: 865, totalContribution: 1270 },
        { minSalary: 9250, maxSalary: 9749.99, employeeContribution: 427.50, employerContribution: 912.50, totalContribution: 1340 },
        { minSalary: 9750, maxSalary: 10249.99, employeeContribution: 450, employerContribution: 960, totalContribution: 1410 },
        { minSalary: 10250, maxSalary: 10749.99, employeeContribution: 472.50, employerContribution: 1007.50, totalContribution: 1480 },
        { minSalary: 10750, maxSalary: 11249.99, employeeContribution: 495, employerContribution: 1055, totalContribution: 1550 },
        { minSalary: 11250, maxSalary: 11749.99, employeeContribution: 517.50, employerContribution: 1102.50, totalContribution: 1620 },
        { minSalary: 11750, maxSalary: 12249.99, employeeContribution: 540, employerContribution: 1150, totalContribution: 1690 },
        { minSalary: 12250, maxSalary: 12749.99, employeeContribution: 562.50, employerContribution: 1197.50, totalContribution: 1760 },
        { minSalary: 12750, maxSalary: 13249.99, employeeContribution: 585, employerContribution: 1245, totalContribution: 1830 },
        { minSalary: 13250, maxSalary: 13749.99, employeeContribution: 607.50, employerContribution: 1292.50, totalContribution: 1900 },
        { minSalary: 13750, maxSalary: 14249.99, employeeContribution: 630, employerContribution: 1340, totalContribution: 1970 },
        { minSalary: 14250, maxSalary: 14749.99, employeeContribution: 652.50, employerContribution: 1387.50, totalContribution: 2040 },
        { minSalary: 14750, maxSalary: 15249.99, employeeContribution: 675, employerContribution: 1455, totalContribution: 2130 },
        { minSalary: 15250, maxSalary: 15749.99, employeeContribution: 697.50, employerContribution: 1502.50, totalContribution: 2200 },
        { minSalary: 15750, maxSalary: 16249.99, employeeContribution: 720, employerContribution: 1550, totalContribution: 2270 },
        { minSalary: 16250, maxSalary: 16749.99, employeeContribution: 742.50, employerContribution: 1597.50, totalContribution: 2340 },
        { minSalary: 16750, maxSalary: 17249.99, employeeContribution: 765, employerContribution: 1645, totalContribution: 2410 },
        { minSalary: 17250, maxSalary: 17749.99, employeeContribution: 787.50, employerContribution: 1692.50, totalContribution: 2480 },
        { minSalary: 17750, maxSalary: 18249.99, employeeContribution: 810, employerContribution: 1740, totalContribution: 2550 },
        { minSalary: 18250, maxSalary: 18749.99, employeeContribution: 832.50, employerContribution: 1787.50, totalContribution: 2620 },
        { minSalary: 18750, maxSalary: 19249.99, employeeContribution: 855, employerContribution: 1835, totalContribution: 2690 },
        { minSalary: 19250, maxSalary: 19749.99, employeeContribution: 877.50, employerContribution: 1882.50, totalContribution: 2760 },
        { minSalary: 19750, maxSalary: 20249.99, employeeContribution: 900, employerContribution: 1930, totalContribution: 2830 },
        { minSalary: 20250, maxSalary: 20749.99, employeeContribution: 922.50, employerContribution: 1977.50, totalContribution: 2900 },
        { minSalary: 20750, maxSalary: 21249.99, employeeContribution: 945, employerContribution: 2025, totalContribution: 2970 },
        { minSalary: 21250, maxSalary: 21749.99, employeeContribution: 967.50, employerContribution: 2072.50, totalContribution: 3040 },
        { minSalary: 21750, maxSalary: 22249.99, employeeContribution: 990, employerContribution: 2120, totalContribution: 3210 },
        { minSalary: 22250, maxSalary: 22749.99, employeeContribution: 1012.50, employerContribution: 2167.50, totalContribution: 3180 },
        { minSalary: 22750, maxSalary: 23249.99, employeeContribution: 1035, employerContribution: 2215, totalContribution: 3250 },
        { minSalary: 23250, maxSalary: 23749.99, employeeContribution: 1057.50, employerContribution: 2262.50, totalContribution: 3320 },
        { minSalary: 23750, maxSalary: 24249.99, employeeContribution: 1080, employerContribution: 2310, totalContribution: 3390 },
        { minSalary: 24250, maxSalary: 24749.99, employeeContribution: 1102.50, employerContribution: 2357.50, totalContribution: 3460 },
        { minSalary: 24750, maxSalary: 25249.99, employeeContribution: 1125, employerContribution: 2405, totalContribution: 3530 },
        { minSalary: 25250, maxSalary: 25749.99, employeeContribution: 1147.50, employerContribution: 2452.50, totalContribution: 3600 },
        { minSalary: 25750, maxSalary: 26249.99, employeeContribution: 1170, employerContribution: 2500, totalContribution: 3670 },
        { minSalary: 26250, maxSalary: 26749.99, employeeContribution: 1192.50, employerContribution: 2547.50, totalContribution: 3740 },
        { minSalary: 26750, maxSalary: 27249.99, employeeContribution: 1215, employerContribution: 2595, totalContribution: 3810 },
        { minSalary: 27250, maxSalary: 27749.99, employeeContribution: 1237.50, employerContribution: 2642.50, totalContribution: 3880 },
        { minSalary: 27750, maxSalary: 28249.99, employeeContribution: 1260, employerContribution: 2690, totalContribution: 3950 },
        { minSalary: 28250, maxSalary: 28749.99, employeeContribution: 1282.50, employerContribution: 2737.50, totalContribution: 4020 },
        { minSalary: 28750, maxSalary: 29249.99, employeeContribution: 1305, employerContribution: 2785, totalContribution: 4090 },
        { minSalary: 29250, maxSalary: 29749.99, employeeContribution: 1327.50, employerContribution: 2832.50, totalContribution: 4160 },
        { minSalary: 29750, maxSalary: Infinity, employeeContribution: 1350, employerContribution: 2880, totalContribution: 4230 },
    ];
      

    // Find the appropriate contribution based on the employee's monthly salary
    const contribution = sssContributionTable.find(entry => employeeMonthlySalary >= entry.minSalary && employeeMonthlySalary <= entry.maxSalary);
    if (contribution) {
        return {
            totalContribution: contribution.totalContribution,
            employeeContribution: contribution.employeeContribution,
            employerContribution: contribution.employerContribution
        };
    } else {
        return "Salary not in range";
    }
}

// Function to calculate withholding tax MONTHLY
export function calculateWithholdingTax(employeeMonthlySalary) {
    let tax = 0;

    if (employeeMonthlySalary <= 20833) {
        tax = 0;
    } else if (employeeMonthlySalary < 33333) {
        tax = (employeeMonthlySalary - 20833) * 0.15;
    } else if (employeeMonthlySalary < 66667) {
        tax = (employeeMonthlySalary - 33333) * 0.20 + 1875;
    } else if (employeeMonthlySalary < 166667) {
        tax = (employeeMonthlySalary - 66667) * 0.25 + 8541.80;
    } else if (employeeMonthlySalary < 666667) {
        tax = (employeeMonthlySalary - 166667) * 0.30 + 33541.80;
    } else {
        tax = (employeeMonthlySalary - 666667) * 0.35 + 183541.80;
    }

    return tax;
}

// // Example usage:
// const employeeSalary = 5000; // Monthly salary in PHP

// let contributions = calculatePagIbig();

// console.log("------------ PAG IBIG -----------");
// console.log("Employee Monthly Salary: PHP", employeeSalary);
// console.log("Employee Contribution: PHP", contributions.employeeContribution);
// console.log("Employer Contribution: PHP", contributions.employerContribution);
// console.log("Total Contribution: PHP", contributions.totalContribution);

// contributions = calculatePhilHealth(employeeSalary);

// console.log("------------ PHILHEALTH -----------");
// console.log("Employee Monthly Salary: PHP", employeeSalary);
// console.log("Employee Contribution: PHP", contributions.employeeContribution);
// console.log("Employer Contribution: PHP", contributions.employerContribution);
// console.log("Total Contribution: PHP", contributions.totalContribution);

// contributions = calculateSSS(employeeSalary);

// console.log("------------ SSS -----------");
// console.log("Employee Monthly Salary: PHP", employeeSalary);
// console.log("Employee Contribution: PHP", contributions.employeeContribution);
// console.log("Employer Contribution: PHP", contributions.employerContribution);
// console.log("Total Contribution: PHP", contributions.totalContribution);

// let tax = calculateWithholdingTax(employeeSalary);

// console.log("------------ WITHHOLDING TAX -----------");
// console.log("Employee Monthly Salary: PHP", employeeSalary);
// console.log("Withholding Tax: PHP", tax);