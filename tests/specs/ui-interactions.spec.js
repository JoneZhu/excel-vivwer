const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('UI Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Excel Viewer/);
  });

  test('should display header with logo and title', async ({ page }) => {
    await expect(page.locator('#header h4')).toHaveText('Excel Viewer');
    await expect(page.locator('#header p')).toContainText('Query Excel files with SQL');
  });

  test('should toggle expand/collapse on resizer click', async ({ page }) => {
    const resizer = page.locator('#resizer');
    const mainContainer = page.locator('#main-container');

    // Initial state - should have shadow
    await expect(mainContainer).toHaveClass(/shadow/);

    // Click resizer
    await resizer.click();

    // Should remove shadow
    await expect(mainContainer).not.toHaveClass(/shadow/);

    // Click again to restore
    await resizer.click();

    // Should have shadow again
    await expect(mainContainer).toHaveClass(/shadow/);
  });

  test('should show/hide expand and collapse icons', async ({ page }) => {
    const resizer = page.locator('#resizer');
    const expandIcon = page.locator('#resizer-expand');
    const collapseIcon = page.locator('#resizer-collapse');

    // Initial state - expand visible, collapse hidden
    await expect(expandIcon).toBeVisible();
    await expect(collapseIcon).toHaveClass(/collapse/);

    // Click resizer
    await resizer.click();

    // Icons should swap
    await expect(expandIcon).toHaveClass(/collapse/);
    await expect(collapseIcon).not.toHaveClass(/collapse/);
  });

  test('should have clickable sample file link', async ({ page }) => {
    const sampleLink = page.locator('#sample-db-link');
    await expect(sampleLink).toBeVisible();
    await expect(sampleLink).toHaveAttribute('href', 'examples/sample.xlsx');
  });

  test('should open file dialog on dropzone click', async ({ page }) => {
    // Create a promise that resolves when file input is triggered
    const fileInputPromise = page.waitForEvent('filechooser');

    // Click dropzone
    await page.click('#dropzone');

    // File chooser should open
    const fileChooser = await fileInputPromise;
    expect(fileChooser).toBeTruthy();
  });

  test('should hide output box initially', async ({ page }) => {
    const outputBox = page.locator('#output-box');
    await expect(outputBox).toBeHidden();
  });

  test('should show output box after file load', async ({ page }) => {
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');
    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);

    // Output box should become visible
    await expect(page.locator('#output-box')).toBeVisible({ timeout: 10000 });
  });

  test('should have ACE editor initialized', async ({ page }) => {
    const hasAceEditor = await page.evaluate(() => {
      return typeof window.aceEditor !== 'undefined' && window.aceEditor !== null;
    });

    expect(hasAceEditor).toBe(true);
  });

  test('should have SQL syntax highlighting in editor', async ({ page }) => {
    const editorMode = await page.evaluate(() => {
      return window.aceEditor ? window.aceEditor.session.getMode().$id : '';
    });

    expect(editorMode).toContain('sql');
  });

  test('should have Select2 initialized on tables dropdown', async ({ page }) => {
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');
    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);
    await page.waitForSelector('#output-box', { state: 'visible' });

    // Check if Select2 container exists
    const hasSelect2 = await page.locator('.select2-container').count();
    expect(hasSelect2).toBeGreaterThan(0);
  });

  test('should display footer with credits', async ({ page }) => {
    await expect(page.locator('#footer')).toBeVisible();
    await expect(page.locator('#footer')).toContainText('Excel Viewer');
    await expect(page.locator('#footer')).toContainText('SheetJS');
    await expect(page.locator('#footer')).toContainText('AlaSQL');
  });

  test('should not show pagination bar initially', async ({ page }) => {
    await expect(page.locator('#bottom-bar')).toHaveClass(/d-none/);
  });

  test('should have execute button enabled', async ({ page }) => {
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');
    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);
    await page.waitForSelector('#output-box', { state: 'visible' });

    const executeButton = page.locator('#sql-run');
    await expect(executeButton).toBeEnabled();
    await expect(executeButton).toHaveText('Execute');
  });

  test('should clear error/info messages between queries', async ({ page }) => {
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');
    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);
    await page.waitForSelector('#output-box', { state: 'visible' });

    // Trigger an error
    await page.evaluate(() => {
      window.aceEditor.setValue('INVALID SQL');
    });
    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Error should be visible
    await expect(page.locator('#error')).toBeVisible();

    // Execute valid query
    await page.evaluate(() => {
      const tableName = window.workbook.SheetNames[0].replace(/[^a-zA-Z0-9_]/g, '_');
      window.aceEditor.setValue(`SELECT * FROM \`${tableName}\` LIMIT 5`);
    });
    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Error should be hidden
    await expect(page.locator('#error')).not.toBeVisible();
  });
});
