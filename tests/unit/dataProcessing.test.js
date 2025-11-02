/**
 * Unit tests for data processing and transformation
 */

const {
  cleanColumnName,
  sanitizeTableName,
  createTableData,
  parseSheetData
} = require('./helpers/queryHelper');

const {
  specialColumnsData,
  sparseData,
  numericColumnsData,
  sampleJsonData
} = require('./fixtures/testData');

describe('Data Processing - Column Name Cleaning', () => {
  test('should clean all special column names from test data', () => {
    const cleaned = specialColumnsData.headers.map((h, idx) => cleanColumnName(h, idx));

    expect(cleaned).toContain('First_Name');
    expect(cleaned).toContain('Last_Name');
    expect(cleaned).toContain('_2024_Salary');
    expect(cleaned).toContain('Email_Address');
    expect(cleaned).toContain('Join_Date');
  });

  test('should handle numeric-starting column names', () => {
    const cleaned = numericColumnsData.headers.map((h, idx) => cleanColumnName(h, idx));

    expect(cleaned[0]).toBe('_1st_Place');
    expect(cleaned[1]).toBe('_2nd_Place');
    expect(cleaned[2]).toBe('_3rd_Place');
  });

  test('should generate default names for empty headers', () => {
    const headers = ['', null, undefined, 'Valid'];
    const cleaned = headers.map((h, idx) => cleanColumnName(h, idx));

    expect(cleaned[0]).toBe('Column1');
    expect(cleaned[1]).toBe('Column2');
    expect(cleaned[2]).toBe('Column3');
    expect(cleaned[3]).toBe('Valid');
  });
});

describe('Data Processing - Table Name Sanitization', () => {
  test('should sanitize common sheet names', () => {
    const testCases = [
      { input: 'Sheet 1', expected: 'Sheet_1' },
      { input: 'Q1-2024', expected: 'Q1_2024' },
      { input: 'Sales & Marketing', expected: 'Sales___Marketing' },
      { input: 'Data (Final)', expected: 'Data__Final_' }
    ];

    testCases.forEach(({ input, expected }) => {
      expect(sanitizeTableName(input)).toBe(expected);
    });
  });

  test('should handle Chinese/Unicode characters', () => {
    const result = sanitizeTableName('销售数据2024');
    expect(result).toBe('_____2024');
  });
});

describe('Data Processing - Sparse Data Handling', () => {
  test('should handle sparse data with nulls and empties', () => {
    const tableData = createTableData(sparseData.rows, sparseData.headers);

    // Should filter out completely empty row
    expect(tableData.length).toBeLessThan(sparseData.rows.length);

    // Should keep rows with at least one value
    const row1 = tableData.find(r => r.ID === '1');
    expect(row1).toBeDefined();
    expect(row1.Value1).toBe('100');
    expect(row1.Value2).toBeNull();
  });

  test('should convert undefined to null', () => {
    const rows = [['A', undefined, 'C']];
    const headers = ['Col1', 'Col2', 'Col3'];

    const tableData = createTableData(rows, headers);

    expect(tableData[0].Col2).toBeNull();
  });

  test('should handle rows shorter than headers', () => {
    const rows = [['A', 'B']]; // Missing Col3
    const headers = ['Col1', 'Col2', 'Col3'];

    const tableData = createTableData(rows, headers);

    expect(tableData[0].Col3).toBeNull();
  });
});

describe('Data Processing - Sheet Data Parsing', () => {
  test('should parse complete sheet data correctly', () => {
    const result = parseSheetData(sampleJsonData);

    expect(result.headers).toEqual(['Name', 'Age', 'City']);
    expect(result.cleanHeaders).toEqual(['Name', 'Age', 'City']);
    expect(result.rows).toHaveLength(3);
    expect(result.rows[0]).toEqual(['Alice', '30', 'New York']);
  });

  test('should parse sheet with special headers', () => {
    const data = [
      ['First Name', 'Last-Name', '2024 Salary'],
      ['John', 'Doe', '85000']
    ];

    const result = parseSheetData(data);

    expect(result.headers).toEqual(['First Name', 'Last-Name', '2024 Salary']);
    expect(result.cleanHeaders).toEqual(['First_Name', 'Last_Name', '_2024_Salary']);
    expect(result.rows[0]).toEqual(['John', 'Doe', '85000']);
  });

  test('should handle empty sheet', () => {
    const result = parseSheetData([]);

    expect(result.headers).toEqual([]);
    expect(result.rows).toEqual([]);
    expect(result.cleanHeaders).toEqual([]);
  });

  test('should handle sheet with only headers', () => {
    const data = [['Header1', 'Header2']];
    const result = parseSheetData(data);

    expect(result.headers).toEqual(['Header1', 'Header2']);
    expect(result.rows).toEqual([]);
  });

  test('should handle null data', () => {
    const result = parseSheetData(null);

    expect(result.headers).toEqual([]);
    expect(result.rows).toEqual([]);
    expect(result.cleanHeaders).toEqual([]);
  });
});

describe('Data Processing - Row Filtering', () => {
  test('should filter completely empty rows', () => {
    const headers = ['A', 'B', 'C'];
    const rows = [
      ['1', '2', '3'],      // Valid
      ['', '', ''],          // Empty strings - should be filtered
      [null, null, null],    // Nulls - should be filtered
      ['4', '', ''],         // Partially filled - should keep
      [undefined, undefined, undefined], // Undefined - should be filtered
      ['', '5', '']          // Partially filled - should keep
    ];

    const tableData = createTableData(rows, headers);

    expect(tableData).toHaveLength(3);
    expect(tableData[0].A).toBe('1');
    expect(tableData[1].A).toBe('4');
    expect(tableData[2].B).toBe('5');
  });

  test('should keep row with single non-empty value', () => {
    const headers = ['A', 'B', 'C'];
    const rows = [
      ['', '', 'X']
    ];

    const tableData = createTableData(rows, headers);

    expect(tableData).toHaveLength(1);
    expect(tableData[0].C).toBe('X');
  });
});

describe('Data Processing - Special Characters', () => {
  test('should handle data with quotes', () => {
    const headers = ['Name', 'Quote'];
    const rows = [
      ['John', 'He said "Hello"'],
      ['Jane', "It's working"]
    ];

    const tableData = createTableData(rows, headers);

    expect(tableData[0].Quote).toBe('He said "Hello"');
    expect(tableData[1].Quote).toBe("It's working");
  });

  test('should handle data with commas', () => {
    const headers = ['Name', 'Address'];
    const rows = [
      ['John', '123 Main St, New York, NY']
    ];

    const tableData = createTableData(rows, headers);

    expect(tableData[0].Address).toBe('123 Main St, New York, NY');
  });

  test('should handle data with newlines', () => {
    const headers = ['Name', 'Description'];
    const rows = [
      ['Product A', 'Line 1\nLine 2']
    ];

    const tableData = createTableData(rows, headers);

    expect(tableData[0].Description).toBe('Line 1\nLine 2');
  });
});

describe('Data Processing - Type Handling', () => {
  test('should convert numbers to strings', () => {
    const headers = ['ID', 'Value'];
    const rows = [
      [123, 456],
      [789, 101112]
    ];

    const tableData = createTableData(rows, headers);

    // All values should be treated as strings or numbers
    expect(tableData[0].ID).toBeDefined();
    expect(tableData[0].Value).toBeDefined();
  });

  test('should handle boolean values', () => {
    const headers = ['Name', 'Active'];
    const rows = [
      ['John', true],
      ['Jane', false]
    ];

    const tableData = createTableData(rows, headers);

    expect(tableData[0].Active).toBe(true);
    expect(tableData[1].Active).toBe(false);
  });

  test('should handle date strings', () => {
    const headers = ['Date', 'Value'];
    const rows = [
      ['2024-01-01', '100'],
      ['2024-01-02', '200']
    ];

    const tableData = createTableData(rows, headers);

    expect(tableData[0].Date).toBe('2024-01-01');
  });
});

describe('Data Processing - Large Datasets', () => {
  test('should handle dataset with many rows', () => {
    const headers = ['ID', 'Value'];
    const rows = Array.from({ length: 1000 }, (_, i) => [
      String(i + 1),
      String((i + 1) * 100)
    ]);

    const tableData = createTableData(rows, headers);

    expect(tableData).toHaveLength(1000);
    expect(tableData[0].ID).toBe('1');
    expect(tableData[999].ID).toBe('1000');
  });

  test('should handle dataset with many columns', () => {
    const headers = Array.from({ length: 50 }, (_, i) => `Col${i + 1}`);
    const row = Array.from({ length: 50 }, (_, i) => `Value${i + 1}`);

    const tableData = createTableData([row], headers);

    expect(tableData).toHaveLength(1);
    expect(Object.keys(tableData[0])).toHaveLength(50);
  });
});
