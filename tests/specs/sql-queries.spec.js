const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('SQL Query Execution', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Load sample file
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');
    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);
    await page.waitForSelector('#output-box', { state: 'visible', timeout: 10000 });

    // Hide info message for cleaner tests
    await page.evaluate(() => {
      hideInfo();
    });
  });

  test('should execute simple SELECT query', async ({ page }) => {
    // Get the first table name
    const tableName = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames[0].replace(/[^a-zA-Z0-9_]/g, '_') : '';
    });

    // Set SQL query
    await page.evaluate((table) => {
      window.aceEditor.setValue(`SELECT * FROM \`${table}\` LIMIT 10`);
    }, tableName);

    // Click execute button
    await page.click('#sql-run');

    // Wait a bit for execution
    await page.waitForTimeout(500);

    // Check that error is not shown
    await expect(page.locator('#error')).not.toBeVisible();

    // Check that table has data
    const tableRows = page.locator('#data tbody tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(10);
  });

  test('should handle WHERE clause correctly', async ({ page }) => {
    const tableName = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames[0].replace(/[^a-zA-Z0-9_]/g, '_') : '';
    });

    // Get column names from the table
    const firstColumnName = await page.locator('#data thead th').first().textContent();

    // Execute query with WHERE clause
    await page.evaluate((sql) => {
      window.aceEditor.setValue(sql);
    }, `SELECT * FROM \`${tableName}\` WHERE ${firstColumnName} IS NOT NULL LIMIT 5`);

    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Should not show error
    await expect(page.locator('#error')).not.toBeVisible();
  });

  test('should handle COUNT aggregation', async ({ page }) => {
    const tableName = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames[0].replace(/[^a-zA-Z0-9_]/g, '_') : '';
    });

    await page.evaluate((sql) => {
      window.aceEditor.setValue(sql);
    }, `SELECT COUNT(*) as TotalRows FROM \`${tableName}\``);

    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Check that result shows count
    const tableRows = page.locator('#data tbody tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBe(1); // Should have exactly one result row

    // Check that header contains TotalRows
    await expect(page.locator('#data thead th')).toContainText('TotalRows');
  });

  test('should display error for invalid SQL', async ({ page }) => {
    await page.evaluate(() => {
      window.aceEditor.setValue('SELECT * FROM NonExistentTable');
    });

    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Should show error message
    await expect(page.locator('#error')).toBeVisible();
    await expect(page.locator('#error')).toContainText('Error');
  });

  test('should display error for empty query', async ({ page }) => {
    await page.evaluate(() => {
      window.aceEditor.setValue('');
    });

    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Should show error message
    await expect(page.locator('#error')).toBeVisible();
    await expect(page.locator('#error')).toContainText('Please enter a SQL query');
  });

  test('should handle query with no results', async ({ page }) => {
    const tableName = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames[0].replace(/[^a-zA-Z0-9_]/g, '_') : '';
    });

    await page.evaluate((sql) => {
      window.aceEditor.setValue(sql);
    }, `SELECT * FROM \`${tableName}\` WHERE 1=0`);

    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Should show info message about no results
    await expect(page.locator('#info')).toBeVisible();
    await expect(page.locator('#info')).toContainText('no results');
  });

  test('should handle ORDER BY clause', async ({ page }) => {
    const tableName = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames[0].replace(/[^a-zA-Z0-9_]/g, '_') : '';
    });

    const firstColumnName = await page.locator('#data thead th').first().textContent();

    await page.evaluate((sql) => {
      window.aceEditor.setValue(sql);
    }, `SELECT * FROM \`${tableName}\` ORDER BY ${firstColumnName} LIMIT 5`);

    await page.click('#sql-run');
    await page.waitForTimeout(500);

    await expect(page.locator('#error')).not.toBeVisible();

    const tableRows = page.locator('#data tbody tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });
});
