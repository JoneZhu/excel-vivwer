# Excel Viewer - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Create Sample Excel File

Open this file in your browser:
```
excel-viewer/examples/create-sample.html
```

This will automatically download `sample.xlsx` with test data (Employees, Departments, Sales).

### Step 2: Start Local Server

```bash
cd excel-viewer
python3 -m http.server 8000
```

Then open in browser: **http://localhost:8000**

### Step 3: Try It!

1. **Drag & drop** `sample.xlsx` into the browser
2. **Write SQL** in the editor, for example:
   ```sql
   SELECT * FROM Employees WHERE Department = 'Engineering'
   ```
3. **Click Execute** to see results!

---

## 📊 Example Queries to Try

```sql
-- View all employees
SELECT * FROM Employees;

-- Filter by department
SELECT Name, Salary FROM Employees
WHERE Department = 'Engineering'
ORDER BY Salary DESC;

-- Calculate average salary by department
SELECT Department, AVG(CAST(Salary AS FLOAT)) as AvgSalary
FROM Employees
GROUP BY Department;

-- Join employees with departments
SELECT e.Name, e.Department, d.Manager, d.Budget
FROM Employees e
JOIN Departments d ON e.Department = d.DepartmentName;

-- Get top 3 highest paid employees
SELECT Name, Department, CAST(Salary AS INT) as Salary
FROM Employees
ORDER BY CAST(Salary AS INT) DESC
LIMIT 3;

-- Count active employees by department
SELECT Department, COUNT(*) as ActiveCount
FROM Employees
WHERE Active = 'Yes'
GROUP BY Department;
```

---

## 💡 Tips

- **Sheet names** with spaces become `Table_Name` (underscores)
- **Column names** with spaces become `Column_Name` (underscores)
- **Numeric operations**: Use `CAST(column AS INT)` or `CAST(column AS FLOAT)`
- **Export**: Click "Export" dropdown to save results as CSV

---

## 🛠 Project Structure

```
excel-viewer/
├── index.html              # Main app (open this)
├── js/
│   ├── main.js            # Core logic (Excel + SQL)
│   ├── xlsx.full.min.js   # SheetJS (Excel parser)
│   ├── alasql.min.js      # SQL engine
│   └── ...
├── css/                    # Styles (Bootstrap + custom)
├── examples/
│   └── create-sample.html # Sample file generator
├── README.md              # Full documentation
├── TEST.md                # Testing guide
└── QUICKSTART.md          # This file
```

---

## 🎯 Key Features

✅ **No upload** - Everything runs in your browser
✅ **Standard SQL** - Use familiar SQL syntax
✅ **Multiple sheets** - Each sheet is a table
✅ **Export results** - Save as CSV
✅ **No installation** - Just open and use

---

## 📚 Learn More

- Full documentation: [README.md](README.md)
- Testing guide: [TEST.md](TEST.md)
- AlaSQL docs: https://github.com/AlaSQL/alasql/wiki
- SheetJS docs: https://docs.sheetjs.com

---

## 🐛 Troubleshooting

**File won't load?**
- Check console (F12) for errors
- Make sure it's a valid .xlsx or .xls file
- Try the sample file first

**SQL error?**
- Check table name matches sheet name (with underscores)
- Use CAST() for numeric comparisons
- Use backticks for special names: `` `Sales Data` ``

**Can't see results?**
- Make sure query executed (check for errors)
- Try `SELECT * FROM TableName LIMIT 10` first

---

**Happy querying! 🎉**
