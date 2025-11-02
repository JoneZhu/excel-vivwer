/**
 * SQL Query Helper Functions
 * These are extracted and testable versions of the main.js functions
 */

/**
 * Clean column names (replace spaces and special characters)
 * @param {string} header - Column header name
 * @param {number} idx - Column index
 * @returns {string} Cleaned header name
 */
function cleanColumnName(header, idx) {
  const headerStr = String(header || 'Column' + (idx + 1));
  return headerStr
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^(\d)/, '_$1'); // Prefix with _ if starts with number
}

/**
 * Sanitize table/sheet name for SQL
 * @param {string} sheetName - Original sheet name
 * @returns {string} Sanitized table name
 */
function sanitizeTableName(sheetName) {
  return sheetName.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Create table data objects from rows and headers
 * @param {Array} rows - Data rows
 * @param {Array} headers - Column headers
 * @returns {Array} Array of row objects
 */
function createTableData(rows, headers) {
  return rows.map(function(row) {
    const obj = {};
    headers.forEach(function(header, idx) {
      obj[header] = row[idx] !== undefined ? row[idx] : null;
    });
    return obj;
  }).filter(function(row) {
    // Filter out completely empty rows
    return Object.values(row).some(function(val) {
      return val !== null && val !== undefined && val !== '';
    });
  });
}

/**
 * Escape SQL string value
 * @param {any} value - Value to escape
 * @returns {string} Escaped SQL value
 */
function escapeSQLValue(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  // Escape single quotes in strings
  return "'" + String(value).replace(/'/g, "''") + "'";
}

/**
 * Build CREATE TABLE SQL statement
 * @param {string} tableName - Table name
 * @param {Array} columns - Column names
 * @returns {string} CREATE TABLE SQL
 */
function buildCreateTableSQL(tableName, columns) {
  let sql = 'CREATE TABLE `' + tableName + '` (';
  sql += columns.map(function(col) {
    return '`' + col + '` STRING';
  }).join(', ');
  sql += ')';
  return sql;
}

/**
 * Build INSERT statement
 * @param {string} tableName - Table name
 * @param {Array} columns - Column names
 * @param {Object} row - Data row
 * @returns {string} INSERT SQL
 */
function buildInsertSQL(tableName, columns, row) {
  const values = columns.map(function(col) {
    return escapeSQLValue(row[col]);
  });
  return 'INSERT INTO `' + tableName + '` VALUES (' + values.join(', ') + ')';
}

/**
 * Validate SQL query syntax (basic validation)
 * @param {string} sql - SQL query
 * @returns {Object} {valid: boolean, error: string|null}
 */
function validateSQL(sql) {
  if (!sql || sql.trim() === '') {
    return { valid: false, error: 'Query is empty' };
  }

  const sqlUpper = sql.trim().toUpperCase();

  // Check for basic SQL commands
  const validCommands = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'];
  const hasValidCommand = validCommands.some(cmd => sqlUpper.startsWith(cmd));

  if (!hasValidCommand) {
    return { valid: false, error: 'Invalid SQL command' };
  }

  // Check for SELECT without FROM (except for special cases)
  if (sqlUpper.startsWith('SELECT') &&
      !sqlUpper.includes('FROM') &&
      !sqlUpper.match(/SELECT\s+\d+/) &&
      !sqlUpper.match(/SELECT\s+['"].*['"]/)) {
    return { valid: false, error: 'SELECT query must have FROM clause' };
  }

  return { valid: true, error: null };
}

/**
 * Parse sheet data (headers and rows)
 * @param {Array} jsonData - Raw JSON data from sheet
 * @returns {Object} {headers: Array, rows: Array, cleanHeaders: Array}
 */
function parseSheetData(jsonData) {
  if (!jsonData || jsonData.length === 0) {
    return { headers: [], rows: [], cleanHeaders: [] };
  }

  const headers = jsonData[0] || [];
  const rows = jsonData.slice(1);

  const cleanHeaders = headers.map((h, idx) => cleanColumnName(h, idx));

  return { headers, rows, cleanHeaders };
}

/**
 * Escape CSV value
 * @param {any} value - Value to escape
 * @returns {string} Escaped CSV value
 */
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Convert query results to CSV
 * @param {Array} results - Query results
 * @returns {string} CSV string
 */
function convertToCSV(results) {
  if (!results || results.length === 0) {
    return '';
  }

  const columns = Object.keys(results[0]);
  const csv = [];

  // Header row
  csv.push(columns.map(escapeCSV).join(','));

  // Data rows
  results.forEach(function(row) {
    const values = columns.map(function(col) {
      const value = row[col];
      return escapeCSV(value !== null && value !== undefined ? String(value) : '');
    });
    csv.push(values.join(','));
  });

  return csv.join('\n');
}

module.exports = {
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
};
