/**
 * Excel Viewer - Query Excel files with SQL
 * Powered by SheetJS (xlsx.js) + AlaSQL
 */

var workbook = null;
var currentSheetName = null;
var aceEditor = null;
var currentQuery = null;
var pageSize = 50;
var currentPage = 1;
var totalRows = 0;

$(document).ready(function() {
    // Check browser compatibility
    if (!window.FileReader) {
        $('#compat-error').removeClass('d-none');
        return;
    }

    // Initialize ACE SQL editor
    initializeEditor();

    // Setup file reader
    setupFileReader();

    // Setup resizer
    setupResizer();

    // Hide output box initially
    $('#output-box').hide();

    // Initialize Select2 for table dropdown
    $('#tables').select2({
        theme: 'bootstrap-5',
        width: '100%'
    }).on('select2:select', function(e) {
        var sheetName = e.params.data.id;
        loadSheet(sheetName);
    });
});

/**
 * Initialize ACE Editor for SQL editing
 */
function initializeEditor() {
    aceEditor = ace.edit("sql-editor");
    aceEditor.setTheme("ace/theme/chrome");
    aceEditor.session.setMode("ace/mode/sql");
    aceEditor.setShowPrintMargin(false);
    aceEditor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        maxLines: 10,
        minLines: 3
    });
    aceEditor.setValue("SELECT * FROM Sheet1 LIMIT 50");
    aceEditor.clearSelection();
}

/**
 * Setup file reader for drag-and-drop and file input
 */
function setupFileReader() {
    FileReaderJS.setupDrop(document.getElementById('dropzone'), {
        readAsDefault: 'ArrayBuffer',
        on: {
            load: function(e, file) {
                loadExcelFile(e.target.result, file.name);
            }
        }
    });

    FileReaderJS.setupInput(document.getElementById('dropzone-dialog'), {
        readAsDefault: 'ArrayBuffer',
        on: {
            load: function(e, file) {
                loadExcelFile(e.target.result, file.name);
            }
        }
    });
}

/**
 * Setup expand/collapse functionality
 */
function setupResizer() {
    $('#resizer').on('click', function(e) {
        e.preventDefault();
        $('#main-container').toggleClass('shadow');
        $('#resizer-expand').toggleClass('collapse');
        $('#resizer-collapse').toggleClass('collapse');
        $('#footer').toggleClass('d-none');
    });
}

/**
 * Handle dropzone click to open file dialog
 */
function dropzoneClick(element) {
    if (!$(element).hasClass('no-propagate')) {
        $('#dropzone-dialog').click();
    }
}

/**
 * Load and parse Excel file
 */
function loadExcelFile(arrayBuffer, fileName) {
    try {
        showLoading(true);

        // Parse Excel file with SheetJS
        workbook = XLSX.read(arrayBuffer, {
            type: 'array',
            cellDates: true,
            cellNF: false,
            cellText: false
        });

        if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            showError('No sheets found in the Excel file');
            return;
        }

        // Load all sheets into AlaSQL
        loadAllSheets();

        // Populate sheet dropdown
        populateSheetDropdown();

        // Load first sheet by default
        loadSheet(workbook.SheetNames[0]);

        // Show output box
        $('#output-box').show();
        showInfo('Loaded file: ' + fileName + ' with ' + workbook.SheetNames.length + ' sheet(s)');

    } catch (error) {
        console.error('Error loading Excel file:', error);
        showError('Error loading Excel file: ' + error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Load all sheets from workbook into AlaSQL
 */
function loadAllSheets() {
    // Clear existing tables in AlaSQL
    alasql.tables = {};

    workbook.SheetNames.forEach(function(sheetName) {
        var worksheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        var jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false,
            dateNF: 'yyyy-mm-dd'
        });

        if (jsonData.length === 0) {
            return;
        }

        // First row as headers
        var headers = jsonData[0];
        var rows = jsonData.slice(1);

        // Clean column names (replace spaces and special characters)
        var cleanHeaders = headers.map(function(h, idx) {
            var header = String(h || 'Column' + (idx + 1));
            return header
                .replace(/[^a-zA-Z0-9_]/g, '_')
                .replace(/^(\d)/, '_$1'); // Prefix with _ if starts with number
        });

        // Create objects with clean headers
        var tableData = rows.map(function(row) {
            var obj = {};
            cleanHeaders.forEach(function(header, idx) {
                obj[header] = row[idx] !== undefined ? row[idx] : null;
            });
            return obj;
        }).filter(function(row) {
            // Filter out completely empty rows
            return Object.values(row).some(function(val) {
                return val !== null && val !== undefined && val !== '';
            });
        });

        // Create table in AlaSQL
        try {
            // Sanitize table name
            var tableName = sheetName.replace(/[^a-zA-Z0-9_]/g, '_');

            // Drop table if exists
            try {
                alasql('DROP TABLE IF EXISTS `' + tableName + '`');
            } catch (e) {
                // Table might not exist, ignore error
            }

            // Create table and insert data using AlaSQL's SELECT INTO syntax
            if (tableData.length > 0) {
                // Create the table structure first
                var createSQL = 'CREATE TABLE `' + tableName + '` (';
                createSQL += cleanHeaders.map(function(h) {
                    return '`' + h + '` STRING';
                }).join(', ');
                createSQL += ')';
                alasql(createSQL);

                // Insert data row by row to avoid issues with parameter passing
                tableData.forEach(function(row) {
                    var values = cleanHeaders.map(function(h) {
                        var val = row[h];
                        if (val === null || val === undefined) {
                            return 'NULL';
                        }
                        // Escape single quotes in strings
                        return "'" + String(val).replace(/'/g, "''") + "'";
                    });
                    var insertSQL = 'INSERT INTO `' + tableName + '` VALUES (' + values.join(', ') + ')';
                    alasql(insertSQL);
                });
            } else {
                // Create empty table with structure
                var createSQL = 'CREATE TABLE `' + tableName + '` (';
                createSQL += cleanHeaders.map(function(h) {
                    return '`' + h + '` STRING';
                }).join(', ');
                createSQL += ')';
                alasql(createSQL);
            }

            console.log('Loaded sheet:', sheetName, 'as table:', tableName, 'with', tableData.length, 'rows');
        } catch (error) {
            console.error('Error creating table for sheet:', sheetName, error);
        }
    });
}

/**
 * Populate sheet dropdown
 */
function populateSheetDropdown() {
    var $select = $('#tables');
    $select.empty();

    workbook.SheetNames.forEach(function(sheetName) {
        $select.append(new Option(sheetName, sheetName));
    });

    $select.trigger('change');
}

/**
 * Load a specific sheet
 */
function loadSheet(sheetName) {
    currentSheetName = sheetName;
    var tableName = sheetName.replace(/[^a-zA-Z0-9_]/g, '_');

    // Update editor with SELECT query
    var sql = 'SELECT * FROM `' + tableName + '` LIMIT ' + pageSize;
    aceEditor.setValue(sql);
    aceEditor.clearSelection();

    // Execute query
    executeSql();
}

/**
 * Execute SQL query
 */
function executeSql() {
    try {
        var sql = aceEditor.getValue().trim();

        if (!sql) {
            showError('Please enter a SQL query');
            return;
        }

        currentQuery = sql;
        currentPage = 1;

        // Execute query with AlaSQL
        var results = alasql(sql);

        // Display results
        renderResults(results);

        hideError();
        hideInfo();

    } catch (error) {
        console.error('SQL execution error:', error);
        showError('SQL Error: ' + error.message);
    }
}

/**
 * Render query results as table
 */
function renderResults(results) {
    var $table = $('#data');
    var $thead = $table.find('thead tr');
    var $tbody = $table.find('tbody');

    $thead.empty();
    $tbody.empty();

    if (!results || results.length === 0) {
        showInfo('Query returned no results');
        return;
    }

    totalRows = results.length;

    // Get columns from first result
    var columns = Object.keys(results[0]);

    // Render header
    columns.forEach(function(col) {
        $thead.append('<th>' + escapeHtml(col) + '</th>');
    });

    // Render rows
    results.forEach(function(row) {
        var $tr = $('<tr>');
        columns.forEach(function(col) {
            var value = row[col];
            var displayValue = value !== null && value !== undefined ? String(value) : '';
            $tr.append('<td>' + escapeHtml(displayValue) + '</td>');
        });
        $tbody.append($tr);
    });

    // Update pagination info
    updatePaginationInfo(results.length);

    // Enable editable table
    $('#data').editableTableWidget();
}

/**
 * Update pagination information
 */
function updatePaginationInfo(rowCount) {
    if (rowCount > 0) {
        $('#pager').text('Showing ' + rowCount + ' row(s)');
        // Pagination controls are hidden for now as AlaSQL returns all results
        $('#bottom-bar').addClass('d-none');
    }
}

/**
 * Set page for pagination
 */
function setPage() {
    // Pagination implementation if needed
    // For now, AlaSQL returns all results at once
}

/**
 * Export all sheets to CSV
 */
function exportAllToCsv() {
    try {
        var zip = new JSZip();

        workbook.SheetNames.forEach(function(sheetName) {
            var tableName = sheetName.replace(/[^a-zA-Z0-9_]/g, '_');
            var results = alasql('SELECT * FROM `' + tableName + '`');
            var csv = convertToCSV(results);
            zip.file(sheetName + '.csv', csv);
        });

        zip.generateAsync({type: 'blob'}).then(function(content) {
            saveAs(content, 'excel-export-all-sheets.zip');
        });

    } catch (error) {
        showError('Export error: ' + error.message);
    }
}

/**
 * Export selected sheet to CSV
 */
function exportSelectedTableToCsv() {
    if (!currentSheetName) {
        showError('No sheet selected');
        return;
    }

    try {
        var tableName = currentSheetName.replace(/[^a-zA-Z0-9_]/g, '_');
        var results = alasql('SELECT * FROM `' + tableName + '`');
        var csv = convertToCSV(results);
        var blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
        saveAs(blob, currentSheetName + '.csv');
    } catch (error) {
        showError('Export error: ' + error.message);
    }
}

/**
 * Export query results to CSV
 */
function exportQueryTableToCsv() {
    if (!currentQuery) {
        showError('No query executed yet');
        return;
    }

    try {
        var results = alasql(currentQuery);
        var csv = convertToCSV(results);
        var blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
        saveAs(blob, 'query-results.csv');
    } catch (error) {
        showError('Export error: ' + error.message);
    }
}

/**
 * Convert array of objects to CSV
 */
function convertToCSV(results) {
    if (!results || results.length === 0) {
        return '';
    }

    var columns = Object.keys(results[0]);
    var csv = [];

    // Header row
    csv.push(columns.map(escapeCSV).join(','));

    // Data rows
    results.forEach(function(row) {
        var values = columns.map(function(col) {
            var value = row[col];
            return escapeCSV(value !== null && value !== undefined ? String(value) : '');
        });
        csv.push(values.join(','));
    });

    return csv.join('\n');
}

/**
 * Escape CSV value
 */
function escapeCSV(value) {
    if (value === null || value === undefined) {
        return '';
    }
    var str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    if (text === null || text === undefined) {
        return '';
    }
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Show/hide loading indicator
 */
function showLoading(show) {
    if (show) {
        $('#drop-text').addClass('d-none');
        $('#drop-loading').removeClass('d-none');
    } else {
        $('#drop-text').removeClass('d-none');
        $('#drop-loading').addClass('d-none');
    }
}

/**
 * Show error message
 */
function showError(message) {
    $('#error').text(message).show();
}

/**
 * Hide error message
 */
function hideError() {
    $('#error').hide();
}

/**
 * Show info message
 */
function showInfo(message) {
    $('#info').text(message).show();
}

/**
 * Hide info message
 */
function hideInfo() {
    $('#info').hide();
}
