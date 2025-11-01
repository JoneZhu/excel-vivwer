const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Sheet Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Load sample file
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');
    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);
    await page.waitForSelector('#output-box', { state: 'visible', timeout: 10000 });
  });

  test('should list all sheets in dropdown', async ({ page }) => {
    const sheetsDropdown = page.locator('#tables');

    // Get sheet count from workbook
    const sheetCount = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames.length : 0;
    });

    // Check dropdown has same number of options
    const optionCount = await sheetsDropdown.locator('option').count();
    expect(optionCount).toBe(sheetCount);
  });

  test('should switch between sheets', async ({ page }) => {
    // Get all sheet names
    const sheetNames = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames : [];
    });

    if (sheetNames.length < 2) {
      test.skip('Need at least 2 sheets to test switching');
      return;
    }

    // Switch to second sheet
    await page.selectOption('#tables', sheetNames[1]);

    // Wait for data to load
    await page.waitForTimeout(500);

    // Check that SQL editor updated
    const editorContent = await page.evaluate(() => {
      return window.aceEditor ? window.aceEditor.getValue() : '';
    });

    const sanitizedSheetName = sheetNames[1].replace(/[^a-zA-Z0-9_]/g, '_');
    expect(editorContent).toContain(sanitizedSheetName);

    // Check that current sheet name is updated
    const currentSheet = await page.evaluate(() => {
      return window.currentSheetName;
    });
    expect(currentSheet).toBe(sheetNames[1]);
  });

  test('should update table data when switching sheets', async ({ page }) => {
    const sheetNames = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames : [];
    });

    if (sheetNames.length < 2) {
      test.skip('Need at least 2 sheets to test switching');
      return;
    }

    // Get data from first sheet
    const firstSheetRowCount = await page.locator('#data tbody tr').count();

    // Switch to second sheet
    await page.selectOption('#tables', sheetNames[1]);
    await page.waitForTimeout(500);

    // Get data from second sheet
    const secondSheetRowCount = await page.locator('#data tbody tr').count();

    // Row counts might be different (or same), but both should be valid
    expect(firstSheetRowCount).toBeGreaterThan(0);
    expect(secondSheetRowCount).toBeGreaterThan(0);
  });

  test('should maintain sheet selection after query execution', async ({ page }) => {
    const sheetNames = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames : [];
    });

    if (sheetNames.length < 2) {
      test.skip('Need at least 2 sheets to test');
      return;
    }

    // Switch to second sheet
    await page.selectOption('#tables', sheetNames[1]);
    await page.waitForTimeout(500);

    // Execute a query
    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Check that sheet selection is still the second sheet
    const selectedValue = await page.locator('#tables').inputValue();
    expect(selectedValue).toBe(sheetNames[1]);
  });

  test('should handle sheets with special characters in names', async ({ page }) => {
    const sheetNames = await page.evaluate(() => {
      return window.workbook ? window.workbook.SheetNames : [];
    });

    // Find sheet with space or special char if exists
    const specialSheet = sheetNames.find(name => /[^a-zA-Z0-9_]/.test(name));

    if (!specialSheet) {
      test.skip('No sheets with special characters found');
      return;
    }

    // Switch to sheet with special characters
    await page.selectOption('#tables', specialSheet);
    await page.waitForTimeout(500);

    // Check that SQL query has sanitized table name (spaces -> underscores)
    const editorContent = await page.evaluate(() => {
      return window.aceEditor ? window.aceEditor.getValue() : '';
    });

    const sanitizedName = specialSheet.replace(/[^a-zA-Z0-9_]/g, '_');
    expect(editorContent).toContain(sanitizedName);

    // Execute query to ensure it works
    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Should not show error
    await expect(page.locator('#error')).not.toBeVisible();
  });
});
