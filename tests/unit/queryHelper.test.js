/**
 * Unit tests for query helper functions
 */

const {
  cleanColumnName,
  sanitizeTableName,
  createTableData,
  escapeSQLValue,
  buildCreateTableSQL,
  buildInsertSQL,
  validateSQL,
  parseSheetData,
  escapeCSV,
  convertToCSV
} = require('./helpers/queryHelper');

const {
  employeeData,
  specialColumnsData,
  sparseData,
  numericColumnsData,
  sampleJsonData,
  sampleQueries,
  invalidQueries
} = require('./fixtures/testData');

describe('cleanColumnName', () => {
  test('should clean column names with spaces', () => {
    expect(cleanColumnName('First Name', 0)).toBe('First_Name');
    expect(cleanColumnName('Last Name', 1)).toBe('Last_Name');
  });

  test('should clean column names with special characters', () => {
    expect(cleanColumnName('Email@Address', 0)).toBe('Email_Address');
    expect(cleanColumnName('Salary-2024', 1)).toBe('Salary_2024');
    expect(cleanColumnName('Price ($)', 2)).toBe('Price____');
  });

  test('should prefix column names starting with numbers', () => {
    expect(cleanColumnName('1st Place', 0)).toBe('_1st_Place');
    expect(cleanColumnName('2024 Salary', 1)).toBe('_2024_Salary');
  });

  test('should handle empty/null column names', () => {
    expect(cleanColumnName('', 0)).toBe('Column1');
    expect(cleanColumnName(null, 1)).toBe('Column2');
    expect(cleanColumnName(undefined, 2)).toBe('Column3');
  });

  test('should handle already clean names', () => {
    expect(cleanColumnName('Name', 0)).toBe('Name');
    expect(cleanColumnName('Age', 1)).toBe('Age');
    expect(cleanColumnName('Employee_ID', 2)).toBe('Employee_ID');
  });
});

describe('sanitizeTableName', () => {
  test('should sanitize table names with spaces', () => {
    expect(sanitizeTableName('Sales Data')).toBe('Sales_Data');
    expect(sanitizeTableName('Employee Records')).toBe('Employee_Records');
  });

  test('should sanitize table names with special characters', () => {
    expect(sanitizeTableName('Q1-2024')).toBe('Q1_2024');
    expect(sanitizeTableName('Sheet #1')).toBe('Sheet__1');
  });

  test('should handle already clean table names', () => {
    expect(sanitizeTableName('Employees')).toBe('Employees');
    expect(sanitizeTableName('Sheet1')).toBe('Sheet1');
  });
});

describe('createTableData', () => {
  test('should create table data from rows and headers', () => {
    const headers = ['Name', 'Age'];
    const rows = [
      ['Alice', '30'],
      ['Bob', '25']
    ];

    const result = createTableData(rows, headers);

    expect(result).toEqual([
      { Name: 'Alice', Age: '30' },
      { Name: 'Bob', Age: '25' }
    ]);
  });

  test('should handle rows with undefined values', () => {
    const headers = ['Name', 'Age', 'City'];
    const rows = [
      ['Alice', '30'],  // Missing City
      ['Bob', '25', 'NYC']
    ];

    const result = createTableData(rows, headers);

    expect(result).toEqual([
      { Name: 'Alice', Age: '30', City: null },
      { Name: 'Bob', Age: '25', City: 'NYC' }
    ]);
  });

  test('should filter out completely empty rows', () => {
    const headers = ['Name', 'Age'];
    const rows = [
      ['Alice', '30'],
      [null, null],
      ['', ''],
      ['Bob', '25']
    ];

    const result = createTableData(rows, headers);

    expect(result).toHaveLength(2);
    expect(result[0].Name).toBe('Alice');
    expect(result[1].Name).toBe('Bob');
  });

  test('should keep rows with at least one non-empty value', () => {
    const headers = ['ID', 'Name', 'Value'];
    const rows = [
      ['1', '', ''],
      ['', 'Bob', ''],
      ['', '', '100']
    ];

    const result = createTableData(rows, headers);

    expect(result).toHaveLength(3);
  });
});

describe('escapeSQLValue', () => {
  test('should escape NULL values', () => {
    expect(escapeSQLValue(null)).toBe('NULL');
    expect(escapeSQLValue(undefined)).toBe('NULL');
  });

  test('should escape string values with single quotes', () => {
    expect(escapeSQLValue('John Doe')).toBe("'John Doe'");
    expect(escapeSQLValue("O'Brien")).toBe("'O''Brien'");
  });

  test('should escape strings with multiple quotes', () => {
    expect(escapeSQLValue("It's a 'test'")).toBe("'It''s a ''test'''");
  });

  test('should handle numbers as strings', () => {
    expect(escapeSQLValue('123')).toBe("'123'");
    expect(escapeSQLValue(123)).toBe("'123'");
  });

  test('should handle empty strings', () => {
    expect(escapeSQLValue('')).toBe("''");
  });
});

describe('buildCreateTableSQL', () => {
  test('should build CREATE TABLE statement', () => {
    const tableName = 'Employees';
    const columns = ['Name', 'Age', 'Department'];

    const sql = buildCreateTableSQL(tableName, columns);

    expect(sql).toBe('CREATE TABLE `Employees` (`Name` STRING, `Age` STRING, `Department` STRING)');
  });

  test('should handle single column', () => {
    const sql = buildCreateTableSQL('Test', ['ID']);
    expect(sql).toBe('CREATE TABLE `Test` (`ID` STRING)');
  });

  test('should handle special column names', () => {
    const sql = buildCreateTableSQL('Data', ['First_Name', 'Email_Address']);
    expect(sql).toContain('`First_Name` STRING');
    expect(sql).toContain('`Email_Address` STRING');
  });
});

describe('buildInsertSQL', () => {
  test('should build INSERT statement', () => {
    const tableName = 'Employees';
    const columns = ['Name', 'Age'];
    const row = { Name: 'John', Age: '30' };

    const sql = buildInsertSQL(tableName, columns, row);

    expect(sql).toBe("INSERT INTO `Employees` VALUES ('John', '30')");
  });

  test('should handle NULL values', () => {
    const row = { Name: 'John', Age: null };
    const sql = buildInsertSQL('Test', ['Name', 'Age'], row);

    expect(sql).toContain('NULL');
  });

  test('should escape single quotes in values', () => {
    const row = { Name: "O'Brien", Title: "It's working" };
    const sql = buildInsertSQL('Test', ['Name', 'Title'], row);

    expect(sql).toContain("'O''Brien'");
    expect(sql).toContain("'It''s working'");
  });
});

describe('validateSQL', () => {
  test('should validate correct SELECT queries', () => {
    expect(validateSQL('SELECT * FROM Employees')).toEqual({ valid: true, error: null });
    expect(validateSQL('SELECT Name, Age FROM Users WHERE Age > 25')).toEqual({ valid: true, error: null });
  });

  test('should reject empty queries', () => {
    expect(validateSQL('')).toEqual({ valid: false, error: 'Query is empty' });
    expect(validateSQL('   ')).toEqual({ valid: false, error: 'Query is empty' });
  });

  test('should reject invalid SQL commands', () => {
    const result = validateSQL('INVALID COMMAND');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid SQL command');
  });

  test('should reject SELECT without FROM (basic case)', () => {
    const result = validateSQL('SELECT Name, Age');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('FROM clause');
  });

  test('should allow valid SQL commands', () => {
    expect(validateSQL('INSERT INTO Test VALUES (1)')).toEqual({ valid: true, error: null });
    expect(validateSQL('UPDATE Test SET value = 1')).toEqual({ valid: true, error: null });
    expect(validateSQL('DELETE FROM Test WHERE id = 1')).toEqual({ valid: true, error: null });
  });

  test('should be case-insensitive', () => {
    expect(validateSQL('select * from employees')).toEqual({ valid: true, error: null });
    expect(validateSQL('SELECT * FROM Employees')).toEqual({ valid: true, error: null });
  });
});

describe('parseSheetData', () => {
  test('should parse valid sheet data', () => {
    const result = parseSheetData(sampleJsonData);

    expect(result.headers).toEqual(['Name', 'Age', 'City']);
    expect(result.rows).toHaveLength(3);
    expect(result.cleanHeaders).toEqual(['Name', 'Age', 'City']);
  });

  test('should handle empty data', () => {
    const result = parseSheetData([]);

    expect(result.headers).toEqual([]);
    expect(result.rows).toEqual([]);
    expect(result.cleanHeaders).toEqual([]);
  });

  test('should clean headers with special characters', () => {
    const data = [
      ['First Name', 'Last-Name', '2024 Salary'],
      ['John', 'Doe', '85000']
    ];

    const result = parseSheetData(data);

    expect(result.cleanHeaders).toEqual(['First_Name', 'Last_Name', '_2024_Salary']);
  });

  test('should handle data with only headers', () => {
    const data = [['Name', 'Age', 'City']];

    const result = parseSheetData(data);

    expect(result.headers).toEqual(['Name', 'Age', 'City']);
    expect(result.rows).toEqual([]);
  });
});

describe('escapeCSV', () => {
  test('should not escape simple values', () => {
    expect(escapeCSV('John')).toBe('John');
    expect(escapeCSV('123')).toBe('123');
  });

  test('should escape values with commas', () => {
    expect(escapeCSV('Smith, John')).toBe('"Smith, John"');
    expect(escapeCSV('100,000')).toBe('"100,000"');
  });

  test('should escape values with double quotes', () => {
    expect(escapeCSV('Say "Hello"')).toBe('"Say ""Hello"""');
  });

  test('should escape values with newlines', () => {
    expect(escapeCSV('Line1\nLine2')).toBe('"Line1\nLine2"');
  });

  test('should handle NULL/undefined values', () => {
    expect(escapeCSV(null)).toBe('');
    expect(escapeCSV(undefined)).toBe('');
  });

  test('should handle empty strings', () => {
    expect(escapeCSV('')).toBe('');
  });
});

describe('convertToCSV', () => {
  test('should convert simple data to CSV', () => {
    const data = [
      { Name: 'John', Age: '30' },
      { Name: 'Jane', Age: '25' }
    ];

    const csv = convertToCSV(data);

    expect(csv).toBe('Name,Age\nJohn,30\nJane,25');
  });

  test('should handle empty results', () => {
    expect(convertToCSV([])).toBe('');
    expect(convertToCSV(null)).toBe('');
  });

  test('should escape special characters in CSV', () => {
    const data = [
      { Product: 'Widget, A', Price: '100' },
      { Product: 'Gadget "X"', Price: '200' }
    ];

    const csv = convertToCSV(data);

    expect(csv).toContain('"Widget, A"');
    expect(csv).toContain('"Gadget ""X"""');
  });

  test('should handle NULL values', () => {
    const data = [
      { Name: 'John', Value: null },
      { Name: 'Jane', Value: '100' }
    ];

    const csv = convertToCSV(data);
    const lines = csv.split('\n');

    expect(lines[1]).toBe('John,');
    expect(lines[2]).toBe('Jane,100');
  });

  test('should maintain column order', () => {
    const data = [
      { C: '3', A: '1', B: '2' }
    ];

    const csv = convertToCSV(data);

    expect(csv).toBe('C,A,B\n3,1,2');
  });
});
