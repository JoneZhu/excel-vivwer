# 测试说明

## 📁 测试文件位置

所有测试相关的文件都已整理到 `tests` 目录下：

```
tests/
├── specs/                        # E2E 测试用例（6个文件，42+测试）
│   ├── file-upload.spec.js
│   ├── sql-queries.spec.js
│   ├── sheet-switching.spec.js
│   ├── export-functions.spec.js
│   ├── ui-interactions.spec.js
│   └── multi-sheet-queries.spec.js
├── unit/                         # 单元测试（3个文件，120+测试）
│   ├── helpers/                  # 可测试的辅助函数
│   ├── fixtures/                 # 测试数据
│   ├── queryHelper.test.js       # 查询辅助函数测试
│   ├── sqlExecution.test.js      # SQL 执行测试
│   ├── dataProcessing.test.js    # 数据处理测试
│   └── README.md                 # 单元测试指南
├── package.json                  # NPM 配置
├── playwright.config.js          # Playwright 配置
├── jest.config.js                # Jest 配置
├── README.md                     # 英文快速指南
├── QUICK_START.md                # 中文快速指南
├── UNIT_TESTS.md                 # 单元测试文档
└── TESTING_GUIDE.md              # 测试导航
```

## 🚀 运行测试（3步）

### 1. 进入测试目录
```bash
cd tests
```

### 2. 安装依赖（首次运行）
```bash
npm install
npx playwright install
```

### 3. 运行测试

#### 运行所有测试（单元测试 + E2E 测试）
```bash
npm test
```

#### 只运行单元测试（快速）
```bash
npm run test:unit
```

#### 只运行 E2E 测试
```bash
npm run test:e2e
```

## 📖 文档导航

### E2E 测试（端到端测试）
- **快速开始**: [tests/QUICK_START.md](tests/QUICK_START.md) （中文）
- **Quick Start**: [tests/README.md](tests/README.md) （英文）
- **详细文档**: [INTEGRATION_TESTS.md](INTEGRATION_TESTS.md)
- **方案总结**: [TEST_SUMMARY.md](TEST_SUMMARY.md)

### 单元测试
- **单元测试文档**: [tests/UNIT_TESTS.md](tests/UNIT_TESTS.md)
- **快速指南**: [tests/unit/README.md](tests/unit/README.md)

## ⚠️ 重要提示

**所有测试命令必须在 `tests` 目录下运行！**

```bash
# 正确 ✅
cd tests
npm test

# 错误 ❌
npm test  # 在项目根目录运行会失败
```

## 🎯 常用命令

```bash
cd tests                    # 进入测试目录

# 所有测试
npm test                    # 运行单元测试 + E2E 测试

# 单元测试（快速，不需要浏览器）
npm run test:unit           # 运行单元测试
npm run test:unit:watch     # 监听模式
npm run test:unit:coverage  # 生成覆盖率报告

# E2E 测试（浏览器测试）
npm run test:e2e            # 运行 E2E 测试
npm run test:e2e:ui         # UI 模式（可视化调试）
npm run test:e2e:debug      # 调试模式
npm run test:report         # 查看 E2E 测试报告
```

## 🔄 CI/CD

GitHub Actions 会自动运行测试：
- 位置: `.github/workflows/integration-tests.yml`
- 触发: Push 到 main、Pull Request
- 查看: GitHub → Actions → Integration Tests

## 📊 测试覆盖

### 单元测试（120+ 测试用例）
✅ 列名和表名清理规范化
✅ SQL 查询构建和验证
✅ SELECT, WHERE, JOIN, 聚合函数
✅ 数据过滤和转换
✅ CSV 导出功能
✅ NULL 值和空值处理
✅ 错误处理和验证

### E2E 测试（42+ 测试用例）
✅ 文件上传和解析
✅ SQL 查询执行
✅ 多 Sheet 支持
✅ 导出功能（CSV/ZIP）
✅ UI 交互
✅ 跨浏览器兼容性（Chromium、Firefox、WebKit）

### 测试统计
- **单元测试**: 3 个文件，26 个测试套件，120+ 测试用例
- **E2E 测试**: 6 个文件，42+ 测试用例
- **总计**: 160+ 测试用例

---

💡 **提示**: 首次使用请阅读 [tests/QUICK_START.md](tests/QUICK_START.md)
