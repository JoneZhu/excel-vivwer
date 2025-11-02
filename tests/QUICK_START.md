# 集成测试快速开始指南

## 📁 目录结构

所有测试相关的文件都在 `tests` 目录下：

```
tests/
├── specs/                        # 测试用例文件
│   ├── file-upload.spec.js       # 文件上传测试
│   ├── sql-queries.spec.js       # SQL 查询测试
│   ├── sheet-switching.spec.js   # Sheet 切换测试
│   ├── export-functions.spec.js  # 导出功能测试
│   ├── ui-interactions.spec.js   # UI 交互测试
│   └── multi-sheet-queries.spec.js # 多表查询测试
├── package.json                  # NPM 配置
├── playwright.config.js          # Playwright 配置
├── README.md                     # 英文文档
└── QUICK_START.md               # 本文件
```

## 🚀 三步运行测试

### 1️⃣ 进入测试目录并安装依赖

```bash
cd tests
npm install
npx playwright install
```

### 2️⃣ 运行测试

```bash
npm test
```

### 3️⃣ 查看测试报告

```bash
npm run test:report
```

## 💡 常用命令

**重要：所有命令都必须在 `tests` 目录下运行！**

```bash
# 进入测试目录
cd tests

# 运行所有测试
npm test

# UI 模式（推荐用于调试）
npm run test:ui

# 调试模式
npm run test:debug

# 运行指定浏览器测试
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# 运行单个测试文件
npx playwright test specs/file-upload.spec.js

# 显示浏览器窗口
npx playwright test --headed

# 查看测试报告
npm run test:report
```

## 📊 测试内容

✅ **文件上传** - 拖拽、选择、解析 Excel 文件
✅ **SQL 查询** - SELECT、WHERE、JOIN、聚合函数
✅ **Sheet 切换** - 多个工作表之间切换
✅ **导出功能** - CSV、ZIP 格式导出
✅ **错误处理** - 无效输入、错误提示
✅ **UI 交互** - 按钮、下拉框、编辑器

## 🌐 支持的浏览器

- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

## 📦 测试数据

测试使用项目根目录的 `sample.xlsx` 文件。

## ⚙️ 环境要求

- Node.js 18+
- Python 3 (用于启动本地服务器)
- Git

## 🔍 调试技巧

### 可视化调试（推荐）
```bash
npm run test:ui
```
- 可以看到测试执行过程
- 时间旅行调试
- 查看 DOM 快照

### 单步调试
```bash
npm run test:debug
```

### 查看浏览器
```bash
npx playwright test --headed
```

## 📝 目录说明

- **`specs/`** - 所有测试用例文件（.spec.js）
- **`package.json`** - NPM 依赖配置和测试脚本
- **`playwright.config.js`** - Playwright 测试配置
- **生成的目录**（已添加到 .gitignore）：
  - `node_modules/` - NPM 依赖包
  - `test-results/` - 测试结果
  - `playwright-report/` - HTML 测试报告
  - `specs/downloads/` - 测试下载文件

## 🔄 CI/CD 集成

测试会在以下情况自动运行：
- Push 到 main 分支
- 创建 Pull Request
- 手动触发 GitHub Actions

查看结果：GitHub → Actions → Integration Tests

## ❓ 常见问题

**Q: 为什么测试要在 tests 目录下运行？**
A: 所有测试配置和依赖都在 tests 目录下，保持测试代码独立。

**Q: 测试失败怎么办？**
A: 查看 `test-results/` 目录的截图和视频，或使用 `npm run test:ui` 调试。

**Q: 如何只测试某个功能？**
A: 运行单个测试文件，如 `npx playwright test specs/sql-queries.spec.js`

**Q: 端口 8000 被占用怎么办？**
A: 修改 `playwright.config.js` 中的端口配置。

## 📚 更多文档

- [README.md](./README.md) - 英文快速指南
- [../INTEGRATION_TESTS.md](../INTEGRATION_TESTS.md) - 详细测试文档
- [../TEST_SUMMARY.md](../TEST_SUMMARY.md) - 测试方案总结

## 🎉 开始测试

```bash
cd tests
npm install
npx playwright install
npm test
```

祝测试愉快！ 🚀
