# Integration Tests Quick Start

## Run Tests in 3 Steps

### 1. Install Dependencies
```bash
cd tests
npm install
npx playwright install
```

### 2. Run Tests
```bash
npm test
```

### 3. View Report
```bash
npm run test:report
```

## Test Files Structure

```
tests/
├── specs/                        # Test files
│   ├── file-upload.spec.js       # File loading tests
│   ├── sql-queries.spec.js       # SQL query tests
│   ├── sheet-switching.spec.js   # Sheet navigation tests
│   ├── export-functions.spec.js  # Export functionality tests
│   ├── ui-interactions.spec.js   # UI component tests
│   └── multi-sheet-queries.spec.js # Multi-sheet SQL tests
├── package.json                  # NPM dependencies
├── playwright.config.js          # Playwright configuration
└── README.md                     # This file
```

## Common Commands

**All commands must be run from the `tests` directory:**

```bash
# Run all tests
npm test

# Run with UI (interactive mode)
npm run test:ui

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run single test file
npx playwright test specs/file-upload.spec.js

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode
npm run test:debug
```

## Prerequisites

- Node.js 18+
- Python 3 (for local server)
- `sample.xlsx` file in project root

## What Gets Tested?

✅ File upload and parsing
✅ SQL query execution
✅ Multi-sheet support
✅ Export to CSV/ZIP
✅ Error handling
✅ UI interactions
✅ Cross-browser compatibility

## Need Help?

See [../INTEGRATION_TESTS.md](../INTEGRATION_TESTS.md) for detailed documentation.
