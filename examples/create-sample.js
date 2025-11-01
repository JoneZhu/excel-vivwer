// Simple script to create a sample Excel file using a CSV-like approach
// This creates test data that can be manually converted to XLSX

const fs = require('fs');
const path = require('path');

// Sample data for README
const readme = `# Excel Viewer Sample Files

## sample.xlsx

This is a sample Excel file with three sheets:

### Sheet 1: Employees
- Employee data with ID, Name, Department, Salary, HireDate, Active status
- 10 employee records

### Sheet 2: Departments
- Department information with DeptID, DepartmentName, Manager, Budget
- 4 department records

### Sheet 3: Sales Data
- Sales transactions with Date, Product, Quantity, Revenue, Region
- 8 sales records

## Example SQL Queries

\`\`\`sql
-- View all employees
SELECT * FROM Employees;

-- Get employees in Engineering department
SELECT * FROM Employees WHERE Department = 'Engineering';

-- Calculate average salary by department
SELECT Department, AVG(CAST(Salary AS FLOAT)) as AvgSalary
FROM Employees
GROUP BY Department;

-- Join employees with departments
SELECT e.Name, e.Department, d.Manager, d.Budget
FROM Employees e
JOIN Departments d ON e.Department = d.DepartmentName;

-- Get total revenue by product
SELECT Product, SUM(CAST(Revenue AS FLOAT)) as TotalRevenue
FROM Sales_Data
GROUP BY Product
ORDER BY TotalRevenue DESC;

-- Get sales by region
SELECT Region, COUNT(*) as SalesCount, SUM(CAST(Revenue AS FLOAT)) as TotalRevenue
FROM Sales_Data
GROUP BY Region;
\`\`\`

## Creating Your Own Sample File

You can create your own Excel file and drag-drop it into the Excel Viewer to query it with SQL!
`;

fs.writeFileSync(path.join(__dirname, 'README.md'), readme);

console.log('Created README.md with sample data information');
console.log('\nTo create the actual sample.xlsx file:');
console.log('1. Open examples/create-sample.html in a browser');
console.log('2. It will automatically download sample.xlsx');
console.log('3. Move the downloaded file to the examples/ folder');
