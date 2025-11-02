/**
 * Test data fixtures for unit tests
 */

// Sample employee data
const employeeData = {
  headers: ['Name', 'Department', 'Salary', 'Hire Date'],
  rows: [
    ['John Doe', 'Engineering', '85000', '2020-01-15'],
    ['Jane Smith', 'Sales', '72000', '2021-03-20'],
    ['Bob Johnson', 'Engineering', '95000', '2019-05-10'],
    ['Alice Wong', 'Marketing', '78000', '2020-08-01'],
    ['Charlie Brown', 'Sales', '68000', '2022-01-15']
  ]
};

// Sample department data
const departmentData = {
  headers: ['DepartmentName', 'Manager', 'Budget'],
  rows: [
    ['Engineering', 'Alice Wong', '500000'],
    ['Sales', 'Bob Lee', '300000'],
    ['Marketing', 'Carol White', '250000']
  ]
};

// Sample sales data with special characters in sheet name
const salesData = {
  sheetName: 'Sales Data',
  headers: ['Product', 'Quantity', 'Revenue', 'Date'],
  rows: [
    ['Widget A', '100', '5000', '2024-01-01'],
    ['Widget B', '50', '3500', '2024-01-02'],
    ['Gadget X', '75', '6000', '2024-01-03'],
    ['Gadget Y', '120', '9600', '2024-01-04']
  ]
};

// Data with special column names
const specialColumnsData = {
  headers: ['First Name', 'Last-Name', '2024 Salary', 'Email@Address', 'Join Date'],
  rows: [
    ['John', 'Doe', '85000', 'john@example.com', '2020-01-15'],
    ['Jane', 'Smith', '72000', 'jane@example.com', '2021-03-20']
  ]
};

// Data with null/empty values
const sparseData = {
  headers: ['ID', 'Name', 'Value1', 'Value2'],
  rows: [
    ['1', 'Item A', '100', ''],
    ['2', 'Item B', '', '200'],
    ['3', '', '150', '175'],
    ['', '', '', '']  // Completely empty row
  ]
};

// Data with numbers starting column names
const numericColumnsData = {
  headers: ['1st Place', '2nd Place', '3rd Place'],
  rows: [
    ['Gold', 'Silver', 'Bronze'],
    ['Winner', 'Runner-up', 'Third']
  ]
};

// Complex data for JOIN testing
const ordersData = {
  headers: ['OrderID', 'CustomerID', 'Product', 'Amount'],
  rows: [
    ['1001', 'C001', 'Widget', '500'],
    ['1002', 'C002', 'Gadget', '750'],
    ['1003', 'C001', 'Tool', '300']
  ]
};

const customersData = {
  headers: ['CustomerID', 'CustomerName', 'City'],
  rows: [
    ['C001', 'Acme Corp', 'New York'],
    ['C002', 'TechCo', 'San Francisco'],
    ['C003', 'BuildIt', 'Chicago']
  ]
};

// Sample JSON data as from XLSX.utils.sheet_to_json
const sampleJsonData = [
  ['Name', 'Age', 'City'],
  ['Alice', '30', 'New York'],
  ['Bob', '25', 'Los Angeles'],
  ['Charlie', '35', 'Chicago']
];

// Expected SQL queries
const sampleQueries = {
  simple: 'SELECT * FROM Employees',
  withLimit: 'SELECT * FROM Employees LIMIT 10',
  withWhere: "SELECT * FROM Employees WHERE Department = 'Engineering'",
  withOrderBy: 'SELECT * FROM Employees ORDER BY Salary DESC',
  withGroupBy: 'SELECT Department, COUNT(*) as Count FROM Employees GROUP BY Department',
  withJoin: 'SELECT e.Name, d.Manager FROM Employees e JOIN Departments d ON e.Department = d.DepartmentName',
  withAggregates: 'SELECT Department, AVG(CAST(Salary AS INT)) as AvgSalary FROM Employees GROUP BY Department',
  multiTable: 'SELECT * FROM Employees UNION SELECT * FROM Contractors'
};

// Invalid queries for testing
const invalidQueries = {
  empty: '',
  whitespace: '   ',
  noFrom: 'SELECT Name, Age',
  invalidCommand: 'INVALID SQL COMMAND',
  malformed: 'SELECT FROM WHERE',
  injection: "'; DROP TABLE Employees; --"
};

// Expected CSV outputs
const expectedCSV = {
  simple: `Name,Department,Salary,Hire Date
John Doe,Engineering,85000,2020-01-15
Jane Smith,Sales,72000,2021-03-20`,
  withSpecialChars: `Product,Value
"Widget, A",100
"Quote""Test",200
"Line
Break",300`
};

module.exports = {
  employeeData,
  departmentData,
  salesData,
  specialColumnsData,
  sparseData,
  numericColumnsData,
  ordersData,
  customersData,
  sampleJsonData,
  sampleQueries,
  invalidQueries,
  expectedCSV
};
