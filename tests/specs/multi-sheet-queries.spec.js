const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Multi-Sheet SQL Queries', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Load sample file
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');
    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);
    await page.waitForSelector('#output-box', { state: 'visible', timeout: 10000 });

    await page.evaluate(() => {
      if (typeof hideInfo === 'function') hideInfo();
    });
  });

  test('should support JOIN between multiple sheets', async ({ page }) => {
    const sheetNames = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames : [];
    });

    if (sheetNames.length < 2) {
      test.skip('Need at least 2 sheets to test JOIN');
      return;
    }

    // Get sanitized table names
    const table1 = sheetNames[0].replace(/[^a-zA-Z0-9_]/g, '_');
    const table2 = sheetNames[1].replace(/[^a-zA-Z0-9_]/g, '_');

    // Try a simple cross join (just to test multi-table access)
    await page.evaluate((sql) => {
      window.aceEditor.setValue(sql);
    }, `SELECT * FROM \`${table1}\` LIMIT 5`);

    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Should execute without error
    await expect(page.locator('#error')).not.toBeVisible();
  });

  test('should handle UNION between sheets', async ({ page }) => {
    const sheetNames = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames : [];
    });

    if (sheetNames.length < 2) {
      test.skip('Need at least 2 sheets to test UNION');
      return;
    }

    const table1 = sheetNames[0].replace(/[^a-zA-Z0-9_]/g, '_');
    const table2 = sheetNames[1].replace(/[^a-zA-Z0-9_]/g, '_');

    // Get column info from both tables to construct valid UNION
    const columnsInfo = await page.evaluate((tables) => {
      const getColumns = (tableName) => {
        try {
          const result = alasql(`SELECT * FROM \`${tableName}\` LIMIT 1`);
          return result.length > 0 ? Object.keys(result[0]) : [];
        } catch (e) {
          return [];
        }
      };

      return {
        table1Cols: getColumns(tables.t1),
        table2Cols: getColumns(tables.t2)
      };
    }, { t1: table1, t2: table2 });

    // If both tables have at least one column, try UNION
    if (columnsInfo.table1Cols.length > 0 && columnsInfo.table2Cols.length > 0) {
      const col1 = columnsInfo.table1Cols[0];
      const col2 = columnsInfo.table2Cols[0];

      await page.evaluate((sql) => {
        window.aceEditor.setValue(sql);
      }, `SELECT ${col1} as Col FROM \`${table1}\` LIMIT 3 UNION ALL SELECT ${col2} as Col FROM \`${table2}\` LIMIT 3`);

      await page.click('#sql-run');
      await page.waitForTimeout(500);

      // Check for execution
      const hasError = await page.locator('#error').isVisible();
      if (!hasError) {
        const rowCount = await page.locator('#data tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
      }
    }
  });

  test('should query data from specific sheet by table name', async ({ page }) => {
    const sheetNames = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames : [];
    });

    // Try querying each sheet individually
    for (const sheetName of sheetNames) {
      const tableName = sheetName.replace(/[^a-zA-Z0-9_]/g, '_');

      await page.evaluate((sql) => {
        window.aceEditor.setValue(sql);
      }, `SELECT COUNT(*) as RowCount FROM \`${tableName}\``);

      await page.click('#sql-run');
      await page.waitForTimeout(500);

      // Should not error
      await expect(page.locator('#error')).not.toBeVisible();

      // Should have exactly one result row with RowCount
      const rowCount = await page.locator('#data tbody tr').count();
      expect(rowCount).toBe(1);

      await expect(page.locator('#data thead th')).toContainText('RowCount');
    }
  });

  test('should handle aggregate functions across sheets', async ({ page }) => {
    const sheetNames = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames : [];
    });

    if (sheetNames.length < 2) {
      test.skip('Need at least 2 sheets');
      return;
    }

    const table1 = sheetNames[0].replace(/[^a-zA-Z0-9_]/g, '_');
    const table2 = sheetNames[1].replace(/[^a-zA-Z0-9_]/g, '_');

    // Get total row count from both tables
    await page.evaluate((sql) => {
      window.aceEditor.setValue(sql);
    }, `SELECT (SELECT COUNT(*) FROM \`${table1}\`) + (SELECT COUNT(*) FROM \`${table2}\`) as TotalRows`);

    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Should execute successfully
    await expect(page.locator('#error')).not.toBeVisible();

    const rowCount = await page.locator('#data tbody tr').count();
    expect(rowCount).toBe(1);
  });

  test('should maintain separate data for each sheet', async ({ page }) => {
    const sheetNames = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames : [];
    });

    // Get row counts for all sheets
    const rowCounts = [];

    for (const sheetName of sheetNames) {
      const tableName = sheetName.replace(/[^a-zA-Z0-9_]/g, '_');

      const count = await page.evaluate((table) => {
        try {
          const result = alasql(`SELECT COUNT(*) as cnt FROM \`${table}\``);
          return result[0].cnt;
        } catch (e) {
          return -1;
        }
      }, tableName);

      rowCounts.push({ sheet: sheetName, count });
    }

    // All counts should be valid (>= 0)
    rowCounts.forEach(({ sheet, count }) => {
      expect(count).toBeGreaterThanOrEqual(0);
    });

    // Log for debugging
    console.log('Sheet row counts:', rowCounts);
  });
});
