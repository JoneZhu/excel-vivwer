# Excel Viewer - Query Excel with SQL

A client-side web application that allows you to query Excel files (.xlsx, .xls) using SQL - directly in your browser. No data is uploaded to any server - all processing happens locally using JavaScript and WebAssembly.

![Excel Viewer](https://img.shields.io/badge/Excel-Viewer-217346?style=for-the-badge&logo=microsoft-excel)
![No Upload](https://img.shields.io/badge/No%20Upload-100%25%20Client--Side-success?style=for-the-badge)

## Features

- **100% Client-Side**: No file upload, all processing in browser
- **SQL Queries**: Use standard SQL to query your Excel data
- **Multiple Sheets**: Each Excel sheet becomes a queryable table
- **Drag & Drop**: Simply drag your Excel file into the browser
- **Export Results**: Export query results or entire sheets to CSV
- **Syntax Highlighting**: SQL editor with auto-completion
- **No Installation**: Just open in browser - no setup required

## Quick Start

### Online Version
Simply open `index.html` in your browser, or visit the hosted version at: [Your URL Here]

### Local Development
```bash
# Clone or download this repository
cd excel-viewer

# Open with any local HTTP server
python -m http.server 8000
# or
python3 -m http.server 8000
# or use any other HTTP server

# Open http://localhost:8000 in your browser
```

### Usage

1. **Load Excel File**
   - Drag & drop your Excel file into the browser
   - Or click to open file dialog
   - Try the sample file: [examples/sample.xlsx](examples/create-sample.html)

2. **Query Your Data**
   - Each Excel sheet becomes a table (spaces replaced with underscores)
   - Write SQL queries in the editor
   - Click "Execute" to run

3. **Example Queries**
   ```sql
   -- View all data from a sheet
   SELECT * FROM Employees;

   -- Filter and sort
   SELECT Name, Salary FROM Employees
   WHERE Department = 'Engineering'
   ORDER BY Salary DESC;

   -- Aggregate functions
   SELECT Department, AVG(Salary) as AvgSalary
   FROM Employees
   GROUP BY Department;

   -- Join multiple sheets
   SELECT e.Name, e.Department, d.Manager
   FROM Employees e
   JOIN Departments d ON e.Department = d.DepartmentName;
   ```

4. **Export Results**
   - Export all sheets to CSV (as ZIP)
   - Export selected sheet to CSV
   - Export query results to CSV

## Technology Stack

- **[SheetJS (xlsx.js)](https://sheetjs.com/)**: Excel file parsing
- **[AlaSQL](https://alasql.org/)**: SQL query engine for JavaScript
- **[ACE Editor](https://ace.c9.io/)**: SQL editor with syntax highlighting
- **[Bootstrap 5](https://getbootstrap.com/)**: UI framework
- **[jQuery](https://jquery.com/)**: DOM manipulation
- **[Select2](https://select2.org/)**: Enhanced select dropdowns
- **[JSZip](https://stuk.github.io/jszip/)**: ZIP file creation
- **[FileSaver.js](https://github.com/eligrey/FileSaver.js/)**: Client-side file downloads

## Architecture

### File Structure
```
excel-viewer/
├── index.html              # Main application page
├── js/
│   ├── main.js            # Core application logic
│   ├── xlsx.full.min.js   # SheetJS - Excel parser
│   ├── alasql.min.js      # AlaSQL - SQL engine
│   ├── filereader.js      # File upload/drag-drop handler
│   ├── ace/               # SQL editor
│   └── [other libraries]
├── css/
│   ├── main.css           # Custom styles
│   └── [bootstrap, select2]
└── examples/
    ├── create-sample.html # Sample Excel file generator
    └── README.md          # Sample data documentation
```

### How It Works

1. **File Loading**: Excel file loaded via FileReader API as ArrayBuffer
2. **Parsing**: SheetJS parses Excel into JSON data
3. **Table Creation**: Each sheet becomes an AlaSQL table
4. **Query Execution**: SQL queries run against in-memory tables
5. **Result Display**: Results rendered as HTML table
6. **Export**: Convert results back to CSV for download

### Column Name Handling

Excel column headers are automatically cleaned for SQL compatibility:
- Spaces replaced with underscores: `First Name` → `First_Name`
- Special characters removed: `Revenue ($)` → `Revenue___`
- Numbers prefixed: `2024 Sales` → `_2024_Sales`

### Sheet Name Handling

Excel sheet names are converted to valid SQL table names:
- Spaces replaced with underscores: `Sales Data` → `Sales_Data`
- Special characters removed
- Use backticks for exact names: `` SELECT * FROM `Sales Data` ``

## Supported SQL Features

AlaSQL supports most SQL-99 features:

- **SELECT**: projections, aliases, DISTINCT
- **WHERE**: filtering with AND, OR, NOT
- **JOIN**: INNER, LEFT, RIGHT, FULL OUTER
- **GROUP BY**: aggregations (COUNT, SUM, AVG, MIN, MAX)
- **ORDER BY**: sorting (ASC, DESC)
- **LIMIT**: result pagination
- **Functions**: String, Math, Date functions
- **Subqueries**: nested SELECT statements
- **UNION**: combine results

See [AlaSQL documentation](https://github.com/AlaSQL/alasql/wiki) for full SQL syntax.

## Browser Compatibility

Works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires HTML5 FileReader API support.

## Limitations

- **File Size**: Large Excel files (>100MB) may be slow to load
- **Memory**: All data loaded into browser memory
- **Data Types**: All columns treated as strings by default (use CAST for numeric operations)
- **Formulas**: Excel formulas are evaluated and stored as values
- **Formatting**: Cell formatting (colors, fonts) is not preserved

## Privacy & Security

- **No Server Upload**: Files never leave your computer
- **No Tracking**: No analytics or data collection
- **Open Source**: All code is visible and auditable
- **Offline Capable**: Works without internet after initial load

## FAQ

**Q: Can I use this with CSV files?**
A: CSV files can be opened in Excel and saved as .xlsx, then used here.

**Q: Can I modify the Excel data?**
A: Currently read-only. Use SQL queries to transform data, then export.

**Q: Can I save my queries?**
A: Queries are not persisted. Copy/paste queries you want to keep.

**Q: Does it work with Google Sheets?**
A: Download Google Sheets as .xlsx first, then load here.

**Q: Can I query multiple Excel files at once?**
A: Not currently. Load one file at a time.

## Development

### No Build Process
This is a static website with no build tooling. All JavaScript is plain ES5/ES6.

### Making Changes
Simply edit the files and refresh browser. No compilation needed.

### Testing
Test manually with various Excel files and SQL queries.

## Inspired By

This project was inspired by [SQLite Viewer](https://github.com/inloop/sqlite-viewer) and adapted for Excel files.

## License

MIT License - feel free to use and modify!

## Contributing

Contributions welcome! Some ideas:
- Add support for Excel formulas
- Implement data editing
- Add chart visualization
- Support for more file formats
- Query history/favorites

## Acknowledgments

- SheetJS team for excellent Excel parsing library
- AlaSQL team for powerful SQL engine
- Original SQLite Viewer project for UI/UX inspiration

---

**Made with ❤️ for data analysts who love SQL**
