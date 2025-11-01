# Testing Excel Viewer

## Quick Test Steps

### 1. Create Sample Excel File

1. Open `examples/create-sample.html` in your browser
2. It will automatically download `sample.xlsx`
3. Save the file

### 2. Start Local Server

```bash
cd excel-viewer
python3 -m http.server 8000
```

Then open: http://localhost:8000

### 3. Test Loading

1. Drag and drop the `sample.xlsx` file onto the dropzone
2. OR click the dropzone to select the file
3. Verify:
   - ✓ File loads without errors
   - ✓ "Loaded file" message appears
   - ✓ Sheet dropdown shows all sheets (Employees, Departments, Sales_Data)
   - ✓ Data table displays content

### 4. Test Sheet Selection

1. Click the sheet dropdown
2. Select different sheets (Employees, Departments, Sales_Data)
3. Verify:
   - ✓ SQL query updates in editor
   - ✓ Table displays correct sheet data
   - ✓ Column headers are correct

### 5. Test SQL Queries

Try these queries:

**Query 1: Simple SELECT**
```sql
SELECT * FROM Employees LIMIT 5
```
Expected: First 5 employees

**Query 2: WHERE clause**
```sql
SELECT * FROM Employees WHERE Department = 'Engineering'
```
Expected: Only Engineering employees

**Query 3: Aggregation**
```sql
SELECT Department, COUNT(*) as Count
FROM Employees
GROUP BY Department
```
Expected: Count of employees per department

**Query 4: JOIN**
```sql
SELECT e.Name, e.Department, d.Manager
FROM Employees e
JOIN Departments d ON e.Department = d.DepartmentName
```
Expected: Employee names with their department managers

**Query 5: Numeric operations**
```sql
SELECT Name, CAST(Salary AS INT) as Salary
FROM Employees
WHERE CAST(Salary AS INT) > 80000
ORDER BY Salary DESC
```
Expected: High earners sorted by salary

### 6. Test Export Functions

1. Click "Export" dropdown
2. Try each option:
   - ✓ "All sheets to CSV" - downloads ZIP file
   - ✓ "Selected sheet to CSV" - downloads single CSV
   - ✓ "Query result to CSV" - downloads query results

### 7. Test Error Handling

Try invalid queries:

```sql
SELECT * FROM NonExistentTable
```
Expected: Error message displayed

```sql
SELECT * FROM Employees WHERE InvalidColumn = 'test'
```
Expected: Error message displayed

### 8. Test Edge Cases

1. **Empty query**: Click Execute with empty editor
   - Expected: Error message "Please enter a SQL query"

2. **Case sensitivity**: Try different table name cases
   ```sql
   SELECT * FROM employees
   SELECT * FROM EMPLOYEES
   SELECT * FROM Employees
   ```
   - Note: Table names might be case-sensitive

3. **Special characters in sheet names**:
   - `Sales Data` becomes `Sales_Data` in SQL

### 9. Browser Compatibility

Test in different browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

### 10. Performance Test

1. Create a larger Excel file (1000+ rows)
2. Test loading time
3. Test query performance

## Known Issues to Watch For

1. **Column names with spaces**: Should be converted to underscores
2. **Numeric comparisons**: Need to use CAST for numeric operations
3. **Date formats**: Dates might be stored as strings
4. **Empty cells**: Should display as empty, not "undefined"

## Debug Checklist

If something doesn't work:

1. **Open browser console** (F12)
2. Check for JavaScript errors
3. Verify libraries loaded:
   ```javascript
   console.log(typeof XLSX);     // should be "object"
   console.log(typeof alasql);   // should be "function"
   console.log(typeof ace);      // should be "object"
   ```

## Success Criteria

- [x] Project structure created
- [x] All libraries downloaded
- [x] HTML page created
- [x] Main JavaScript logic implemented
- [ ] Sample Excel file created
- [ ] Basic loading works
- [ ] SQL queries execute correctly
- [ ] Export functions work
- [ ] No console errors

## Next Steps After Testing

1. Fix any bugs found
2. Improve error messages
3. Add loading indicators
4. Optimize performance
5. Add more example queries
6. Create GitHub Pages deployment
