/**
 * Unit tests for SQL query execution using AlaSQL
 */

const alasql = require('alasql');
const {
  employeeData,
  departmentData,
  ordersData,
  customersData
} = require('./fixtures/testData');

// Helper function to setup test database
function setupTestDatabase() {
  // Clear existing tables
  alasql.tables = {};

  // Create Employees table
  alasql('CREATE TABLE Employees (Name STRING, Department STRING, Salary STRING, HireDate STRING)');
  employeeData.rows.forEach(row => {
    alasql('INSERT INTO Employees VALUES (?, ?, ?, ?)', row);
  });

  // Create Departments table
  alasql('CREATE TABLE Departments (DepartmentName STRING, Manager STRING, Budget STRING)');
  departmentData.rows.forEach(row => {
    alasql('INSERT INTO Departments VALUES (?, ?, ?)', row);
  });
}

// Helper to setup Orders and Customers
function setupOrdersDatabase() {
  alasql.tables = {};

  alasql('CREATE TABLE Orders (OrderID STRING, CustomerID STRING, Product STRING, Amount STRING)');
  ordersData.rows.forEach(row => {
    alasql('INSERT INTO Orders VALUES (?, ?, ?, ?)', row);
  });

  alasql('CREATE TABLE Customers (CustomerID STRING, CustomerName STRING, City STRING)');
  customersData.rows.forEach(row => {
    alasql('INSERT INTO Customers VALUES (?, ?, ?)', row);
  });
}

describe('SQL Query Execution - Basic Queries', () => {
  beforeEach(() => {
    setupTestDatabase();
  });

  afterEach(() => {
    alasql.tables = {};
  });

  test('should execute simple SELECT * query', () => {
    const results = alasql('SELECT * FROM Employees');

    expect(results).toHaveLength(5);
    expect(results[0].Name).toBe('John Doe');
    expect(results[0].Department).toBe('Engineering');
  });

  test('should execute SELECT with specific columns', () => {
    const results = alasql('SELECT Name, Department FROM Employees');

    expect(results).toHaveLength(5);
    expect(Object.keys(results[0])).toEqual(['Name', 'Department']);
    expect(results[0].Salary).toBeUndefined();
  });

  test('should execute SELECT with LIMIT', () => {
    const results = alasql('SELECT * FROM Employees LIMIT 3');

    expect(results).toHaveLength(3);
  });

  test('should execute SELECT with WHERE clause', () => {
    const results = alasql("SELECT * FROM Employees WHERE Department = 'Engineering'");

    expect(results).toHaveLength(2);
    expect(results[0].Name).toBe('John Doe');
    expect(results[1].Name).toBe('Bob Johnson');
  });

  test('should execute SELECT with ORDER BY ASC', () => {
    const results = alasql('SELECT * FROM Employees ORDER BY Name ASC');

    expect(results[0].Name).toBe('Alice Wong');
    expect(results[4].Name).toBe('John Doe');
  });

  test('should execute SELECT with ORDER BY DESC', () => {
    const results = alasql('SELECT * FROM Employees ORDER BY Name DESC');

    expect(results[0].Name).toBe('John Doe');
    expect(results[4].Name).toBe('Alice Wong');
  });
});

describe('SQL Query Execution - Aggregate Functions', () => {
  beforeEach(() => {
    setupTestDatabase();
  });

  afterEach(() => {
    alasql.tables = {};
  });

  test('should execute COUNT(*)', () => {
    const results = alasql('SELECT COUNT(*) as Total FROM Employees');

    expect(results).toHaveLength(1);
    expect(results[0].Total).toBe(5);
  });

  test('should execute COUNT with WHERE', () => {
    const results = alasql("SELECT COUNT(*) as Total FROM Employees WHERE Department = 'Engineering'");

    expect(results[0].Total).toBe(2);
  });

  test('should execute GROUP BY with COUNT', () => {
    const results = alasql('SELECT Department, COUNT(*) as Count FROM Employees GROUP BY Department');

    expect(results).toHaveLength(3);

    const engineering = results.find(r => r.Department === 'Engineering');
    expect(engineering.Count).toBe(2);

    const sales = results.find(r => r.Department === 'Sales');
    expect(sales.Count).toBe(2);
  });

  test('should execute SUM with CAST', () => {
    const results = alasql('SELECT SUM(CAST(Salary AS INT)) as TotalSalary FROM Employees');

    expect(results[0].TotalSalary).toBe(398000);
  });

  test('should execute AVG with CAST', () => {
    const results = alasql('SELECT AVG(CAST(Salary AS INT)) as AvgSalary FROM Employees');

    expect(results[0].AvgSalary).toBe(79600);
  });

  test('should execute MAX and MIN', () => {
    const maxResult = alasql('SELECT MAX(CAST(Salary AS INT)) as MaxSalary FROM Employees');
    const minResult = alasql('SELECT MIN(CAST(Salary AS INT)) as MinSalary FROM Employees');

    expect(maxResult[0].MaxSalary).toBe(95000);
    expect(minResult[0].MinSalary).toBe(68000);
  });

  test('should execute GROUP BY with multiple aggregates', () => {
    const results = alasql(`
      SELECT
        Department,
        COUNT(*) as Count,
        AVG(CAST(Salary AS INT)) as AvgSalary
      FROM Employees
      GROUP BY Department
    `);

    expect(results).toHaveLength(3);

    const engineering = results.find(r => r.Department === 'Engineering');
    expect(engineering.Count).toBe(2);
    expect(engineering.AvgSalary).toBe(90000);
  });
});

describe('SQL Query Execution - JOIN Operations', () => {
  beforeEach(() => {
    setupTestDatabase();
  });

  afterEach(() => {
    alasql.tables = {};
  });

  test('should execute INNER JOIN', () => {
    const results = alasql(`
      SELECT e.Name, e.Department, d.Manager
      FROM Employees e
      INNER JOIN Departments d ON e.Department = d.DepartmentName
    `);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('Name');
    expect(results[0]).toHaveProperty('Manager');
  });

  test('should execute JOIN with WHERE clause', () => {
    const results = alasql(`
      SELECT e.Name, d.Budget
      FROM Employees e
      JOIN Departments d ON e.Department = d.DepartmentName
      WHERE e.Department = 'Engineering'
    `);

    expect(results).toHaveLength(2);
    expect(results[0].Budget).toBe('500000');
  });

  test('should execute multiple table JOIN', () => {
    setupOrdersDatabase();

    const results = alasql(`
      SELECT o.OrderID, o.Product, c.CustomerName
      FROM Orders o
      JOIN Customers c ON o.CustomerID = c.CustomerID
    `);

    expect(results).toHaveLength(3);
    expect(results[0]).toHaveProperty('CustomerName');
  });
});

describe('SQL Query Execution - Advanced Queries', () => {
  beforeEach(() => {
    setupTestDatabase();
  });

  afterEach(() => {
    alasql.tables = {};
  });

  test('should execute DISTINCT', () => {
    const results = alasql('SELECT DISTINCT Department FROM Employees');

    expect(results).toHaveLength(3);
  });

  test('should execute subquery', () => {
    const results = alasql(`
      SELECT * FROM Employees
      WHERE CAST(Salary AS INT) > (SELECT AVG(CAST(Salary AS INT)) FROM Employees)
    `);

    expect(results.length).toBeGreaterThan(0);
    results.forEach(emp => {
      expect(parseInt(emp.Salary)).toBeGreaterThan(79600);
    });
  });

  test('should execute UNION', () => {
    const results = alasql(`
      SELECT Name FROM Employees WHERE Department = 'Engineering'
      UNION
      SELECT Name FROM Employees WHERE Department = 'Sales'
    `);

    expect(results).toHaveLength(4);
  });

  test('should execute UNION ALL', () => {
    const results = alasql(`
      SELECT Name FROM Employees WHERE Department = 'Engineering'
      UNION ALL
      SELECT Name FROM Employees WHERE Department = 'Sales'
    `);

    expect(results).toHaveLength(4);
  });

  test('should execute query with LIKE', () => {
    const results = alasql("SELECT * FROM Employees WHERE Name LIKE '%John%'");

    expect(results).toHaveLength(2); // John Doe and Bob Johnson
  });

  test('should execute query with IN', () => {
    const results = alasql(`
      SELECT * FROM Employees
      WHERE Department IN ('Engineering', 'Sales')
    `);

    expect(results).toHaveLength(4);
  });

  test('should execute query with BETWEEN', () => {
    const results = alasql(`
      SELECT * FROM Employees
      WHERE CAST(Salary AS INT) BETWEEN 70000 AND 85000
    `);

    expect(results.length).toBeGreaterThan(0);
    results.forEach(emp => {
      const salary = parseInt(emp.Salary);
      expect(salary).toBeGreaterThanOrEqual(70000);
      expect(salary).toBeLessThanOrEqual(85000);
    });
  });
});

describe('SQL Query Execution - HAVING Clause', () => {
  beforeEach(() => {
    setupTestDatabase();
  });

  afterEach(() => {
    alasql.tables = {};
  });

  test('should execute GROUP BY with HAVING', () => {
    const results = alasql(`
      SELECT Department, COUNT(*) as Count
      FROM Employees
      GROUP BY Department
      HAVING COUNT(*) >= 2
    `);

    expect(results).toHaveLength(2); // Engineering and Sales both have 2
  });

  test('should execute HAVING with aggregate condition', () => {
    const results = alasql(`
      SELECT Department, AVG(CAST(Salary AS INT)) as AvgSalary
      FROM Employees
      GROUP BY Department
      HAVING AVG(CAST(Salary AS INT)) > 75000
    `);

    results.forEach(dept => {
      expect(dept.AvgSalary).toBeGreaterThan(75000);
    });
  });
});

describe('SQL Query Execution - Error Handling', () => {
  beforeEach(() => {
    setupTestDatabase();
  });

  afterEach(() => {
    alasql.tables = {};
  });

  test('should throw error for non-existent table', () => {
    expect(() => {
      alasql('SELECT * FROM NonExistentTable');
    }).toThrow();
  });

  test('should throw error for invalid SQL syntax', () => {
    expect(() => {
      alasql('SELECT FROM WHERE');
    }).toThrow();
  });

  test('should throw error for non-existent column', () => {
    expect(() => {
      alasql('SELECT NonExistentColumn FROM Employees');
    }).toThrow();
  });

  test('should handle empty result set', () => {
    const results = alasql("SELECT * FROM Employees WHERE Name = 'Nobody'");

    expect(results).toEqual([]);
    expect(results).toHaveLength(0);
  });
});

describe('SQL Query Execution - NULL Handling', () => {
  beforeEach(() => {
    alasql.tables = {};
    alasql('CREATE TABLE TestNull (ID STRING, Value STRING)');
    alasql('INSERT INTO TestNull VALUES (?, ?)', ['1', 'A']);
    alasql('INSERT INTO TestNull VALUES (?, ?)', ['2', null]);
    alasql('INSERT INTO TestNull VALUES (?, ?)', ['3', 'C']);
  });

  afterEach(() => {
    alasql.tables = {};
  });

  test('should handle IS NULL', () => {
    const results = alasql('SELECT * FROM TestNull WHERE Value IS NULL');

    expect(results).toHaveLength(1);
    expect(results[0].ID).toBe('2');
  });

  test('should handle IS NOT NULL', () => {
    const results = alasql('SELECT * FROM TestNull WHERE Value IS NOT NULL');

    expect(results).toHaveLength(2);
  });
});
