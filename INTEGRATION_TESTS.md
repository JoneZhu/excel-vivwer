# Integration Test Suite Documentation

## Overview

This project uses **Playwright** for end-to-end integration testing. The test suite covers all major functionality of the Excel Viewer application, including file upload, SQL queries, sheet switching, and export features.

## Test Architecture

### Technology Stack
- **Playwright**: Cross-browser automation framework
- **Test Runner**: Playwright Test
- **Browsers**: Chromium, Firefox, WebKit
- **Web Server**: Python HTTP server (automatic start during tests)

### Test Structure
```
tests/
├── file-upload.spec.js         # File loading and parsing tests
├── sql-queries.spec.js          # SQL query execution tests
├── sheet-switching.spec.js      # Multi-sheet navigation tests
├── export-functions.spec.js     # CSV/ZIP export tests
├── ui-interactions.spec.js      # UI component tests
└── multi-sheet-queries.spec.js  # Cross-sheet SQL queries
```

## Setup

### Prerequisites
- Node.js 18+ installed
- Python 3 installed (for local web server)
- Git

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

3. **Install system dependencies** (Linux only)
   ```bash
   npx playwright install-deps
   ```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:ui
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Specific Test File
```bash
npx playwright test tests/file-upload.spec.js
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### View Test Report
```bash
npm run test:report
```

## Test Coverage

### 1. File Upload Tests (`file-upload.spec.js`)
- ✅ Initial dropzone display
- ✅ Browser compatibility detection
- ✅ File loading from dialog
- ✅ Data table rendering
- ✅ Loading indicator display
- ✅ SQL editor initialization

**Key scenarios:**
- User drops Excel file
- User clicks to select file
- Invalid/corrupted file handling

### 2. SQL Query Tests (`sql-queries.spec.js`)
- ✅ Simple SELECT queries
- ✅ WHERE clause filtering
- ✅ Aggregate functions (COUNT, SUM, AVG)
- ✅ ORDER BY sorting
- ✅ LIMIT pagination
- ✅ Error handling for invalid SQL
- ✅ Empty query validation
- ✅ No results handling

**Example queries tested:**
```sql
SELECT * FROM Sheet1 LIMIT 10
SELECT * FROM Sheet1 WHERE column1 IS NOT NULL
SELECT COUNT(*) FROM Sheet1
SELECT * FROM Sheet1 ORDER BY column1
```

### 3. Sheet Switching Tests (`sheet-switching.spec.js`)
- ✅ Sheet dropdown population
- ✅ Switching between sheets
- ✅ SQL query auto-update on switch
- ✅ Table data refresh
- ✅ Special characters in sheet names
- ✅ Sheet selection persistence

**Key scenarios:**
- Multiple sheets in workbook
- Sheet names with spaces/special characters
- SQL table name sanitization

### 4. Export Function Tests (`export-functions.spec.js`)
- ✅ Export selected sheet to CSV
- ✅ Export query results to CSV
- ✅ Export all sheets to ZIP
- ✅ CSV format validation
- ✅ File download verification
- ✅ Error handling when no query executed

**Export formats:**
- Single CSV file
- Multiple CSV files in ZIP
- UTF-8 encoding support

### 5. UI Interaction Tests (`ui-interactions.spec.js`)
- ✅ Page title and headers
- ✅ Expand/collapse functionality
- ✅ ACE editor initialization
- ✅ Select2 dropdown enhancement
- ✅ Footer display
- ✅ Error message clearing
- ✅ Execute button functionality

**UI components tested:**
- Dropzone
- ACE SQL editor
- Select2 dropdowns
- Bootstrap modals
- Loading spinners

### 6. Multi-Sheet Query Tests (`multi-sheet-queries.spec.js`)
- ✅ JOIN operations between sheets
- ✅ UNION queries
- ✅ Cross-sheet aggregations
- ✅ Individual sheet queries
- ✅ Data isolation between sheets

**Advanced SQL tested:**
```sql
SELECT * FROM Sheet1
JOIN Sheet2 ON Sheet1.id = Sheet2.id

SELECT col FROM Sheet1
UNION ALL
SELECT col FROM Sheet2

SELECT COUNT(*) FROM Sheet1 + COUNT(*) FROM Sheet2
```

## CI/CD Integration

### GitHub Actions Workflow

The test suite runs automatically on:
- Push to `main` branch
- Pull requests to `main`
- Manual workflow dispatch

**Workflow file:** `.github/workflows/integration-tests.yml`

**Features:**
- Multi-browser testing (Chromium, Firefox, WebKit)
- Parallel execution
- Automatic artifact upload
- HTML test reports
- Screenshot/video on failure

### Viewing CI Results

1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. Download artifacts (test reports, screenshots, videos)
4. Open `index.html` in downloaded report

## Test Data

### Sample File: `sample.xlsx`

The test suite uses `sample.xlsx` in the project root as test data. This file should contain:

**Recommended structure:**
- Multiple sheets (2-3 minimum)
- Various data types (text, numbers, dates)
- Some sheets with special characters in names
- Data with NULL values
- Different row counts per sheet

**Example sheets:**
1. **Employees** - employee records
2. **Departments** - department info
3. **Sales_Data** - sales transactions

## Debugging Tests

### Common Issues

**1. Test timeout**
```bash
# Increase timeout in playwright.config.js
timeout: 30000  // 30 seconds
```

**2. Web server not starting**
```bash
# Manually start server first
python3 -m http.server 8000

# Then run tests with existing server
npx playwright test --no-server
```

**3. Browser installation issues**
```bash
# Reinstall browsers
npx playwright install --force
```

**4. File path issues**
```bash
# Check sample.xlsx exists
ls -la sample.xlsx

# Use absolute path in test
const filePath = path.resolve(__dirname, '..', 'sample.xlsx');
```

### Debug Specific Test
```bash
# Run single test with debug
npx playwright test tests/file-upload.spec.js:12 --debug
```

### Generate Test Code
```bash
# Use Playwright codegen to record interactions
npx playwright codegen http://localhost:8000
```

## Best Practices

### Writing New Tests

1. **Use descriptive test names**
   ```javascript
   test('should load Excel file and display first sheet', async ({ page }) => {
     // test code
   });
   ```

2. **Use proper selectors**
   ```javascript
   // Good - use data-testid or specific IDs
   await page.locator('#dropzone').click();

   // Avoid - brittle CSS selectors
   await page.locator('div > div.container > button').click();
   ```

3. **Add proper waits**
   ```javascript
   // Wait for element
   await page.waitForSelector('#output-box', { state: 'visible' });

   // Wait for network
   await page.waitForLoadState('networkidle');
   ```

4. **Clean up after tests**
   ```javascript
   test.afterEach(async () => {
     // Clean up downloads, temp files, etc.
   });
   ```

### Performance Tips

- Use `test.beforeEach()` for common setup
- Run tests in parallel when possible
- Use fixtures for reusable logic
- Mock external dependencies if needed

## Continuous Improvement

### Adding New Test Cases

1. Create test file in `tests/` directory
2. Follow naming convention: `feature-name.spec.js`
3. Add test to CI workflow (automatic)
4. Update this documentation

### Test Metrics

Track these metrics:
- Total test count
- Pass rate
- Average execution time
- Browser compatibility
- Code coverage (future)

## Troubleshooting

### Test Failing Locally but Passing in CI

- Check Node.js version
- Check browser versions
- Clear Playwright cache
- Verify sample.xlsx is correct

### Test Failing in CI but Passing Locally

- Check timeout settings
- Verify GitHub Actions runner OS
- Check artifact uploads
- Review CI logs

### All Tests Timing Out

- Verify web server starts correctly
- Check port 8000 is not in use
- Increase global timeout
- Check network connectivity

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions for Playwright](https://playwright.dev/docs/ci)

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review test logs and screenshots
3. Create new issue with:
   - Test output
   - Screenshot/video
   - System info
   - Steps to reproduce
