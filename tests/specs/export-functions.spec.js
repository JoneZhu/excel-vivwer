const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('Export Functions', () => {
  let downloadPath;

  test.beforeEach(async ({ page, context }) => {
    // Set up downloads directory
    downloadPath = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }

    await page.goto('/');

    // Load sample file
    const filePath = path.join(__dirname, '..', '..', 'sample.xlsx');
    const fileInput = page.locator('#dropzone-dialog');
    await fileInput.setInputFiles(filePath);
    await page.waitForSelector('#output-box', { state: 'visible', timeout: 10000 });
  });

  test.afterEach(() => {
    // Clean up downloads
    if (fs.existsSync(downloadPath)) {
      fs.rmSync(downloadPath, { recursive: true, force: true });
    }
  });

  test('should have export dropdown button', async ({ page }) => {
    const exportButton = page.locator('#dropdownMenu1');

    // Export dropdown might be hidden initially
    // This test just checks if the element exists
    const count = await exportButton.count();
    expect(count).toBe(1);
  });

  test('should show export dropdown menu on click', async ({ page }) => {
    // Make dropdown visible first
    await page.evaluate(() => {
      document.querySelector('.dropdown').classList.remove('d-none');
    });

    const exportButton = page.locator('#dropdownMenu1');
    await exportButton.click();

    // Check menu items exist
    await expect(page.locator('text=All sheets to CSV')).toBeVisible();
    await expect(page.locator('text=Selected sheet to CSV')).toBeVisible();
    await expect(page.locator('text=Query result to CSV')).toBeVisible();
  });

  test('should export selected sheet to CSV', async ({ page }) => {
    // Make dropdown visible
    await page.evaluate(() => {
      document.querySelector('.dropdown').classList.remove('d-none');
    });

    // Set up download handler
    const downloadPromise = page.waitForEvent('download');

    // Click export dropdown
    await page.locator('#dropdownMenu1').click();

    // Click export selected sheet
    await page.locator('text=Selected sheet to CSV').click();

    // Wait for download
    const download = await downloadPromise;

    // Check filename
    expect(download.suggestedFilename()).toMatch(/\.csv$/);

    // Save and verify file
    const downloadedPath = path.join(downloadPath, download.suggestedFilename());
    await download.saveAs(downloadedPath);

    // Verify file exists and has content
    expect(fs.existsSync(downloadedPath)).toBe(true);
    const content = fs.readFileSync(downloadedPath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  test('should export query result to CSV', async ({ page }) => {
    // Make dropdown visible
    await page.evaluate(() => {
      document.querySelector('.dropdown').classList.remove('d-none');
    });

    // Execute a query first
    await page.click('#sql-run');
    await page.waitForTimeout(500);

    // Set up download handler
    const downloadPromise = page.waitForEvent('download');

    // Click export dropdown
    await page.locator('#dropdownMenu1').click();

    // Click export query results
    await page.locator('text=Query result to CSV').click();

    // Wait for download
    const download = await downloadPromise;

    // Check filename
    expect(download.suggestedFilename()).toBe('query-results.csv');

    // Save and verify file
    const downloadedPath = path.join(downloadPath, download.suggestedFilename());
    await download.saveAs(downloadedPath);

    // Verify file exists and has content
    expect(fs.existsSync(downloadedPath)).toBe(true);
    const content = fs.readFileSync(downloadedPath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);

    // Check that CSV has headers (first line should contain column names)
    const lines = content.split('\n');
    expect(lines.length).toBeGreaterThan(1);
  });

  test('should export all sheets to ZIP', async ({ page }) => {
    // Make dropdown visible
    await page.evaluate(() => {
      document.querySelector('.dropdown').classList.remove('d-none');
    });

    // Set up download handler
    const downloadPromise = page.waitForEvent('download');

    // Click export dropdown
    await page.locator('#dropdownMenu1').click();

    // Click export all sheets
    await page.locator('text=All sheets to CSV').click();

    // Wait for download
    const download = await downloadPromise;

    // Check filename is a zip file
    expect(download.suggestedFilename()).toBe('excel-export-all-sheets.zip');

    // Save file
    const downloadedPath = path.join(downloadPath, download.suggestedFilename());
    await download.saveAs(downloadedPath);

    // Verify file exists
    expect(fs.existsSync(downloadedPath)).toBe(true);

    // Verify it's a valid ZIP file (check magic number)
    const buffer = fs.readFileSync(downloadedPath);
    // ZIP files start with 'PK' (0x504B)
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4B);
  });

  test('should show error when exporting before executing query', async ({ page }) => {
    // Clear current query execution state
    await page.evaluate(() => {
      window.currentQuery = null;
    });

    // Make dropdown visible
    await page.evaluate(() => {
      document.querySelector('.dropdown').classList.remove('d-none');
    });

    // Click export dropdown
    await page.locator('#dropdownMenu1').click();

    // Click export query results
    await page.locator('text=Query result to CSV').click();

    // Should show error
    await expect(page.locator('#error')).toBeVisible();
    await expect(page.locator('#error')).toContainText('No query executed');
  });
});
