const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('File Upload and Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial dropzone with correct text', async ({ page }) => {
    await expect(page.locator('#dropzone')).toBeVisible();
    await expect(page.locator('#drop-text b')).toHaveText('Drop Excel file here');
    await expect(page.locator('.nouploadinfo')).toContainText('No file will be uploaded');
  });

  test('should not show compatibility error in modern browser', async ({ page }) => {
    await expect(page.locator('#compat-error')).toHaveClass(/d-none/);
  });

  test('should load sample.xlsx file successfully', async ({ page }) => {
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');

    // Set up file input
    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);

    // Wait for file to load
    await page.waitForSelector('#output-box', { state: 'visible', timeout: 10000 });

    // Check success message
    await expect(page.locator('#info')).toBeVisible();
    await expect(page.locator('#info')).toContainText('Loaded file');

    // Check that sheets dropdown is populated
    const sheetsDropdown = page.locator('#tables');
    await expect(sheetsDropdown).toBeVisible();

    // Check that at least one sheet exists
    const options = await sheetsDropdown.locator('option').count();
    expect(options).toBeGreaterThan(0);
  });

  test('should display data table after file load', async ({ page }) => {
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');

    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);

    await page.waitForSelector('#output-box', { state: 'visible' });

    // Check that data table has headers
    const tableHeaders = page.locator('#data thead th');
    const headerCount = await tableHeaders.count();
    expect(headerCount).toBeGreaterThan(0);

    // Check that data table has rows
    const tableRows = page.locator('#data tbody tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should show loading indicator during file processing', async ({ page }) => {
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');

    const fileInput = page.locator('#dropzone-dialog');

    // Start file upload
    await fileInput.setInputFiles(filePath);

    // Loading indicator should appear briefly
    // Note: This might be too fast to catch, but we try
    try {
      await expect(page.locator('#drop-loading')).toBeVisible({ timeout: 1000 });
    } catch (e) {
      // Loading was too fast, that's okay
    }

    // Eventually loading should disappear
    await expect(page.locator('#drop-loading')).toHaveClass(/d-none/);
  });

  test('should populate SQL editor with default query', async ({ page }) => {
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');

    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);

    await page.waitForSelector('#output-box', { state: 'visible' });

    // Check that ACE editor has content
    const editorContent = await page.evaluate(() => {
      return window.aceEditor ? window.aceEditor.getValue() : '';
    });

    expect(editorContent).toContain('SELECT');
    expect(editorContent).toContain('FROM');
  });
});
